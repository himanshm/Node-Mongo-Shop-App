const deleteProduct = async (btn: Element) => {
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
  if (prodIdInput && csrfToken) {
    const prodId = prodIdInput.value;
    const csrf = csrfToken.value;

    const productElement = btn.closest('article');
    // Ensure productElement is not null and is an HTMLElement before proceeding.
    if (productElement instanceof HTMLElement) {
      try {
        const response = await fetch('/admin/product/' + prodId, {
          method: 'DELETE',
          headers: {
            'csrf-token': csrf,
          },
        });

        const data = await response.json();
        console.log(data);

        // Use optional chaining for parentNode in case it's null
        productElement.parentNode?.removeChild(productElement);
      } catch (err) {
        // Handle any errors that occur during the fetch
        console.error(err);
      }
    }
  }
};
