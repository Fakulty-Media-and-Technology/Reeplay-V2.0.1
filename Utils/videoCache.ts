import RNFS from 'react-native-fs';

// ✅ Returns a cached file path for a given video URL
export const getCachedVideo = async (videoUrl: string): Promise<string> => {
  if (!videoUrl) return '';

  const filename = videoUrl.split('/').pop() || 'temp_video.mp4';
  const path = `${RNFS.CachesDirectoryPath}/${filename}`;

  const exists = await RNFS.exists(path);
  if (exists) return `file://${path}`;

  try {
    await RNFS.downloadFile({
      fromUrl: videoUrl,
      toFile: path,
    }).promise;
    return `file://${path}`;
  } catch (err) {
    console.warn('Video caching failed, using original URL', err);
    return videoUrl;
  }
};
