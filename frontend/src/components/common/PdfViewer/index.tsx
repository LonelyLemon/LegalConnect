import React, { useEffect, useMemo, useState } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import Pdf from 'react-native-pdf';
import { useRoute } from '@react-navigation/native';
import { useAppTheme } from '../../../theme/theme.provider';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../layout/header';
import * as styles from './styles';
import RNFS from 'react-native-fs';
import { showError } from '../../../types/toast';
import { t } from '../../../i18n';
export default function PdfViewerScreen() {
  const route = useRoute<any>();
  const { themed, theme } = useAppTheme();
  const url: string | undefined = route?.params?.url;
  const title: string | undefined = route?.params?.title;
  const [localUri, setLocalUri] = useState<string | undefined>(undefined);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<boolean>(false);

  const source = useMemo(() => {
    const uri = localUri || url || '';
    return { uri, cache: true, headers: { Accept: 'application/pdf' } } as any;
  }, [localUri, url]);

  useEffect(() => {
    let cancelled = false;
    const downloadIfNeeded = async () => {
      if (!url || !url.startsWith('http')) {
        setLocalUri(undefined);
        return;
      }
      try {
        setDownloading(true);
        const clean = url.split('?')[0];
        const name = decodeURIComponent(
          clean.substring(clean.lastIndexOf('/') + 1) || 'document.pdf',
        );
        const toFile = `${RNFS.CachesDirectoryPath}/${name}`;
        const res = await RNFS.downloadFile({ fromUrl: url, toFile }).promise;
        if (
          !cancelled &&
          res.statusCode &&
          res.statusCode >= 200 &&
          res.statusCode < 300
        ) {
          setLocalUri(`file://${toFile}`);
        } else if (!cancelled) {
          setLocalUri(undefined); // fall back to remote
        }
      } catch (e: any) {
        if (!cancelled) {
          setLocalUri(undefined);
          showError(t('toast.pdfLoadFailed'), e?.message || t('toast.pdfDownloadFailed'));
        }
      } finally {
        if (!cancelled) setDownloading(false);
      }
    };
    downloadIfNeeded();
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <SafeAreaView style={themed(styles.container)} edges={['top', 'bottom']}>
      <Header title={title || 'PDF Viewer'} />
      <View style={themed(styles.pdfContainer)}>
        {url ? (
          <Pdf
            source={source}
            style={themed(styles.pdfStyle)}
            trustAllCerts={true}
            onLoadComplete={() => {
              setLoaded(true);
            }}
            onError={(err: any) => {
              const msg = String(err?.message || err || 'Unknown error');
              // Bỏ qua lỗi nền khi file vẫn render được
              if (!loaded && !/IllegalState/i.test(msg)) {
                showError(t('toast.pdfRenderError'), msg);
              }
            }}
            renderActivityIndicator={() => (
              <ActivityIndicator color={theme.colors.primary} />
            )}
          />
        ) : (
          <View style={themed(styles.pdfContainer)}>
            <Text style={themed(styles.pdfText)}>No PDF file selected</Text>
          </View>
        )}
        {/* {downloading && !loaded && (
          <View style={themed(styles.loadingOverlay)}>
            <ActivityIndicator color={theme.colors.primary} size="large" />
          </View>
        )} */}
      </View>
    </SafeAreaView>
  );
}
