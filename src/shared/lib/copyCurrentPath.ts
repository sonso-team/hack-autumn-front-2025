const copyCurrentUrl = async (roomId: string) => {
  try {
    await navigator.clipboard.writeText(
      `https://${window.location.host}/${roomId}`,
    );
  } catch (err) {
    console.error(err);
  }
};

export default copyCurrentUrl;
