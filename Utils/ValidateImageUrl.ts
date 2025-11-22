export const checkImageUrlValidity = async (imageUrl: string) => {
  try {
    const response = await fetch(imageUrl);
    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
