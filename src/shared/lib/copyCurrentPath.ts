const copyCurrentUrl = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch (err) {
    console.error(err);
  }
};

export default copyCurrentUrl;
