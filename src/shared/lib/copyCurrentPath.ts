const copyCurrentUrl = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
  } catch (err) {}
};

export default copyCurrentUrl;
