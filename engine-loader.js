(() => {
  const nativeFetch = window.fetch.bind(window);
  window.fetch = async (input, options) => {
    const target = new URL(typeof input === 'string' ? input : input.url, document.baseURI);
    if (target.origin === location.origin && target.pathname.endsWith('/index.wasm')) {
      if (!('DecompressionStream' in window)) throw new Error('瀏覽器版本較舊，請更新 Chrome 或 Safari 後重試。');
      const response = await nativeFetch(new URL('engine.bin', target), options);
      if (!response.ok) throw new Error('遊戲載入失敗，請重新整理後再試。');
      return new Response(response.body.pipeThrough(new DecompressionStream('gzip')), {
        headers: {'Content-Type':'application/wasm','Content-Length':'39514754'}
      });
    }
    return nativeFetch(input, options);
  };
})();