const deleteProduct = (btn: Element) => {
  // Assuming btn.parentNode is not null and is an HTMLElement
  const parentNode = btn.parentNode as HTMLElement;

  // Assuming the elements exist, but adding checks or type assertions as needed
  const prodIdInput = parentNode.querySelector(
    '[name=productId]'
  ) as HTMLInputElement;
  const csrfToken = parentNode.querySelector(
    '[name=_csrf]'
  ) as HTMLInputElement;

  // Extracting values with optional chaining and nullish coalescing to handle potential null values safely
  const prodId = prodIdInput?.value ?? '';
  const csrf = csrfToken?.value ?? '';
};
