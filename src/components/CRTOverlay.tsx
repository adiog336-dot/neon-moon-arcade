const CRTOverlay = () => {
  return (
    <>
      {/* Scanlines */}
      <div className="crt-overlay animate-flicker" />
      {/* Vignette */}
      <div className="vignette" />
    </>
  );
};

export default CRTOverlay;
