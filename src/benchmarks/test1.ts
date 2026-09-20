onmessage = (e) => {
  const {iterations} = e.data;
  setTimeout(() => {
    postMessage({})}, 
    iterations
  );
};
