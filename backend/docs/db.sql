-- ====================================================================
-- Database DDL for the LegalConnect core (PostgreSQL)
-- Requirements:
-- - UUID primary keys with default generation
-- - UTC timestamps for create_at / updated_at
-- - ON DELETE behaviors and unique/index constraints as specified
-- ====================================================================

-- Use UTC so DEFAULT now() yields UTC values in this session
SET TIME ZONE 'UTC';

-- UUID generation (PostgreSQL 13+)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- --------------------------------------------------------------------
-- Helper: auto-update "updated_at" on row changes
-- --------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

-- ====================================================================
-- Base note:
-- Every table includes:
--   id UUID PRIMARY KEY DEFAULT gen_random_uuid()
--   create_at timestamptz NOT NULL DEFAULT now()
--   updated_at timestamptz NOT NULL DEFAULT now()
-- ====================================================================


-- ====================================================================
-- user
-- ====================================================================
CREATE TABLE "user" (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  create_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  username           varchar(50)  NOT NULL,
  email              varchar(50)  NOT NULL,
  hashed_password    varchar(255) NOT NULL,
  phone_number       varchar(20),
  address            varchar(200),
  role               varchar(20)  NOT NULL DEFAULT 'client',
  is_email_verified  boolean      NOT NULL DEFAULT true,
  email_verification_sent_at timestamptz
);

-- Uniqueness & lookup indexes
CREATE UNIQUE INDEX uq_user_email ON "user"(email);
CREATE UNIQUE INDEX uq_user_phone ON "user"(phone_number);
CREATE INDEX ix_user_email ON "user"(email);
CREATE INDEX ix_user_role ON "user"(role);

-- updated_at trigger
CREATE TRIGGER trg_user_set_updated_at
BEFORE UPDATE ON "user"
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ====================================================================
-- lawyer_verification_request
-- ====================================================================
CREATE TABLE lawyer_verification_request (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  create_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  user_id                    UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  identity_card_front_url    varchar(255) NOT NULL,
  identity_card_back_url     varchar(255) NOT NULL,
  portrait_url               varchar(255) NOT NULL,
  law_certificate_url        varchar(255) NOT NULL,
  bachelor_degree_url        varchar(255) NOT NULL,
  years_of_experience        integer NOT NULL,
  current_job_position       varchar,
  status                     varchar(20) NOT NULL DEFAULT 'pending',
  rejection_reason           varchar(500),
  reviewed_by_admin_id       UUID REFERENCES "user"(id) ON DELETE SET NULL,
  reviewed_at                timestamptz
);

CREATE INDEX ix_lvr_user_id ON lawyer_verification_request(user_id);
CREATE INDEX ix_lvr_status ON lawyer_verification_request(status);

CREATE TRIGGER trg_lvr_set_updated_at
BEFORE UPDATE ON lawyer_verification_request
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ====================================================================
-- lawyer_profile (1:1 with user; public profile for verified lawyers)
-- ====================================================================
CREATE TABLE lawyer_profile (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  create_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  user_id             UUID NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
  display_name        varchar NOT NULL,
  phone_number        varchar,
  website_url         varchar,
  office_address      varchar,
  speaking_languages  text[] NOT NULL DEFAULT '{}',
  education           varchar,
  current_level       varchar,
  years_of_experience integer NOT NULL DEFAULT 0
);

CREATE INDEX ix_lawyer_profile_user_id ON lawyer_profile(user_id);

CREATE TRIGGER trg_lawyer_profile_set_updated_at
BEFORE UPDATE ON lawyer_profile
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ====================================================================
-- lawyer_role_revocation (audit when admin revokes a lawyer role)
-- ====================================================================
CREATE TABLE lawyer_role_revocation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  create_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  user_id             UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  revoked_by_admin_id UUID REFERENCES "user"(id) ON DELETE SET NULL,
  reason              varchar NOT NULL
);

CREATE INDEX ix_lrr_user_id ON lawyer_role_revocation(user_id);
CREATE INDEX ix_lrr_revoked_by ON lawyer_role_revocation(revoked_by_admin_id);

CREATE TRIGGER trg_lrr_set_updated_at
BEFORE UPDATE ON lawyer_role_revocation
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ====================================================================
-- law_documentation (admin-uploaded legal docs, stored in S3)
-- ====================================================================
CREATE TABLE law_documentation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  create_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  display_name       varchar(255) NOT NULL,
  s3_key             varchar(255) NOT NULL,
  original_filename  varchar(255) NOT NULL,
  content_type       varchar(100) NOT NULL,
  uploaded_by_id     UUID REFERENCES "user"(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX uq_law_doc_s3_key ON law_documentation(s3_key);
CREATE INDEX ix_law_doc_uploader ON law_documentation(uploaded_by_id);

CREATE TRIGGER trg_law_doc_set_updated_at
BEFORE UPDATE ON law_documentation
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ====================================================================
-- lawyer_schedule_slot (availability blocks)
-- ====================================================================
CREATE TABLE lawyer_schedule_slot (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  create_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  lawyer_id  UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  start_time timestamptz NOT NULL,
  end_time   timestamptz NOT NULL,
  is_booked  boolean NOT NULL DEFAULT false,

  CHECK (end_time > start_time)
);

CREATE INDEX ix_lss_lawyer_time ON lawyer_schedule_slot(lawyer_id, start_time, end_time);
CREATE INDEX ix_lss_is_booked ON lawyer_schedule_slot(is_booked);

CREATE TRIGGER trg_lss_set_updated_at
BEFORE UPDATE ON lawyer_schedule_slot
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ====================================================================
-- booking_request (client-initiated meeting requests)
-- ====================================================================
CREATE TABLE booking_request (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  create_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  client_id         UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  lawyer_id         UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  schedule_slot_id  UUID REFERENCES lawyer_schedule_slot(id) ON DELETE SET NULL,
  title             varchar(200) NOT NULL,
  short_description varchar(1000) NOT NULL,
  desired_start_time timestamptz NOT NULL,
  desired_end_time   timestamptz NOT NULL,
  attachment_key     varchar(255),
  status            varchar(20) NOT NULL DEFAULT 'pending',
  decision_at       timestamptz,

  CHECK (desired_end_time > desired_start_time)
);

CREATE INDEX ix_br_client ON booking_request(client_id);
CREATE INDEX ix_br_lawyer ON booking_request(lawyer_id);
CREATE INDEX ix_br_slot ON booking_request(schedule_slot_id);
CREATE INDEX ix_br_status ON booking_request(status);

CREATE TRIGGER trg_br_set_updated_at
BEFORE UPDATE ON booking_request
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ====================================================================
-- case_history (accepted bookings & ongoing work)
-- ====================================================================
CREATE TABLE case_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  create_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  booking_request_id UUID REFERENCES booking_request(id) ON DELETE SET NULL,
  lawyer_id          UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  client_id          UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  title              varchar(200) NOT NULL,
  description        text,
  state              varchar(20) NOT NULL DEFAULT 'in_progress',
  attachment_keys    text[] NOT NULL DEFAULT '{}',
  lawyer_note        varchar(2000),
  client_note        varchar(2000),
  started_at         timestamptz NOT NULL DEFAULT now(),
  ending_time        timestamptz
);

CREATE INDEX ix_ch_booking ON case_history(booking_request_id);
CREATE INDEX ix_ch_lawyer ON case_history(lawyer_id);
CREATE INDEX ix_ch_client ON case_history(client_id);
CREATE INDEX ix_ch_state  ON case_history(state);
CREATE INDEX ix_ch_started_at ON case_history(started_at);

CREATE TRIGGER trg_ch_set_updated_at
BEFORE UPDATE ON case_history
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ====================================================================
-- lawyer_rating (one rating per case)
-- ====================================================================
CREATE TABLE lawyer_rating (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  create_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  case_history_id UUID NOT NULL UNIQUE REFERENCES case_history(id) ON DELETE CASCADE,
  lawyer_id       UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  client_id       UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  stars           integer NOT NULL CHECK (stars BETWEEN 1 AND 5)
);

CREATE INDEX ix_lr_lawyer ON lawyer_rating(lawyer_id);
CREATE INDEX ix_lr_client ON lawyer_rating(client_id);

CREATE TRIGGER trg_lr_set_updated_at
BEFORE UPDATE ON lawyer_rating
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ====================================================================
-- chat_conversations (top-level threads)
-- ====================================================================
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  create_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  last_message_at timestamptz
);

CREATE INDEX ix_cc_last_message_at ON chat_conversations(last_message_at);

CREATE TRIGGER trg_cc_set_updated_at
BEFORE UPDATE ON chat_conversations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ====================================================================
-- chat_participants (membership)
-- ====================================================================
CREATE TABLE chat_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  create_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  conversation_id UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  last_read_at    timestamptz
);

-- Unique membership constraint
CREATE UNIQUE INDEX uq_chat_participant_membership
  ON chat_participants(conversation_id, user_id);

-- Lookup indexes
CREATE INDEX ix_cp_conversation ON chat_participants(conversation_id);
CREATE INDEX ix_cp_user ON chat_participants(user_id);

CREATE TRIGGER trg_cp_set_updated_at
BEFORE UPDATE ON chat_participants
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ====================================================================
-- chat_messages (individual messages)
-- ====================================================================
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  create_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  conversation_id          UUID NOT NULL REFERENCES chat_conversations(id) ON DELETE CASCADE,
  sender_id                UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  content                  text,
  attachment_name          varchar(255),
  attachment_key           varchar(512),
  attachment_content_type  varchar(100),
  attachment_size          integer
);

CREATE INDEX ix_cm_conversation ON chat_messages(conversation_id);
CREATE INDEX ix_cm_sender ON chat_messages(sender_id);
CREATE INDEX ix_cm_created_at ON chat_messages(create_at);

CREATE TRIGGER trg_cm_set_updated_at
BEFORE UPDATE ON chat_messages
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ====================================================================
-- chat_message_receipts (delivery/read per recipient)
-- ====================================================================
CREATE TABLE chat_message_receipts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  create_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  message_id  UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  delivered_at timestamptz,
  read_at      timestamptz
);

-- One receipt per (message, user)
CREATE UNIQUE INDEX uq_chat_message_receipt
  ON chat_message_receipts(message_id, user_id);

-- Lookup indexes
CREATE INDEX ix_cmr_message ON chat_message_receipts(message_id);
CREATE INDEX ix_cmr_user ON chat_message_receipts(user_id);

CREATE TRIGGER trg_cmr_set_updated_at
BEFORE UPDATE ON chat_message_receipts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ====================================================================
-- End of DDL
-- ====================================================================
