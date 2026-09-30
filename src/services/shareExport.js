import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { buildExport } from './export';

// Sur le web, aucun systeme de fichiers : on declenche un telechargement.
const shareOnWeb = ({ fileName, mimeType, content }) => {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return url;
};

const shareOnNative = async ({ fileName, mimeType, content }) => {
  const uri = `${FileSystem.cacheDirectory}${fileName}`;
  await FileSystem.writeAsStringAsync(uri, content, {
    encoding: FileSystem.EncodingType.UTF8,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(uri, { mimeType, dialogTitle: fileName });
  }
  return uri;
};

export const shareExport = async (format, data) => {
  const payload = buildExport(format, data);
  if (Platform.OS === 'web') return shareOnWeb(payload);
  return shareOnNative(payload);
};
