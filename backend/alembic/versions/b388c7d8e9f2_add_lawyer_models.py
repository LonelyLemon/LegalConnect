"""Add lawyer models and relationships

Revision ID: b388c7d8e9f2
Revises: a277ec65b7b1
Create Date: 2025-10-19 08:50:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = 'b388c7d8e9f2'
down_revision: Union[str, Sequence[str], None] = 'a277ec65b7b1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    # Create specialties table
    op.create_table('specialties',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('create_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    
    # Create lawyer_profiles table
    op.create_table('lawyer_profiles',
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('create_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('years_experience', sa.Integer(), nullable=True),
        sa.Column('price_per_session_cents', sa.BigInteger(), nullable=True),
        sa.Column('currency', sa.String(length=10), nullable=False),
        sa.Column('province', sa.String(length=120), nullable=True),
        sa.Column('rating_avg', sa.Numeric(precision=3, scale=2), nullable=False),
        sa.Column('rating_count', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('user_id')
    )
    
    # Create lawyer_specialties table
    op.create_table('lawyer_specialties',
        sa.Column('lawyer_user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('specialty_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.ForeignKeyConstraint(['lawyer_user_id'], ['lawyer_profiles.user_id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['specialty_id'], ['specialties.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('lawyer_user_id', 'specialty_id')
    )
    op.create_index('ix_lawyer_specialties_specialty_id', 'lawyer_specialties', ['specialty_id'], unique=False)
    
    # Create lawyer_availability table
    op.create_table('lawyer_availability',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('create_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('lawyer_user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('start_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('end_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('is_booked', sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(['lawyer_user_id'], ['lawyer_profiles.user_id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_lawyer_availability_lawyer_start', 'lawyer_availability', ['lawyer_user_id', 'start_at'], unique=False)
    
    # Create reviews table
    op.create_table('reviews',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('create_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('updated_at', sa.TIMESTAMP(timezone=True), nullable=False),
        sa.Column('appointment_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('client_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('lawyer_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('rating', sa.Numeric(precision=2, scale=1), nullable=False),
        sa.Column('comment', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['client_id'], ['user.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['lawyer_id'], ['lawyer_profiles.user_id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('appointment_id')
    )
    op.create_index('ix_reviews_lawyer_rating', 'reviews', ['lawyer_id', 'rating'], unique=False)


def downgrade() -> None:
    """Downgrade schema."""
    # Drop tables in reverse order
    op.drop_index('ix_reviews_lawyer_rating', table_name='reviews')
    op.drop_table('reviews')
    op.drop_index('ix_lawyer_availability_lawyer_start', table_name='lawyer_availability')
    op.drop_table('lawyer_availability')
    op.drop_index('ix_lawyer_specialties_specialty_id', table_name='lawyer_specialties')
    op.drop_table('lawyer_specialties')
    op.drop_table('lawyer_profiles')
    op.drop_table('specialties')
