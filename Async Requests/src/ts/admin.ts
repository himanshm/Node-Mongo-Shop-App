// const deleteProduct = async (btn: Element) => {
//   // Assuming btn.parentNode is not null and is an HTMLElement
//   const parentNode = btn.parentNode as HTMLElement;

//   // Assuming the elements exist, but adding checks or type assertions as needed
//   const prodIdInput = parentNode.querySelector(
//     '[name=productId]'
//   ) as HTMLInputElement;
//   const csrfToken = parentNode.querySelector(
//     '[name=_csrf]'
//   ) as HTMLInputElement;

//   // Extracting values with optional chaining and nullish coalescing to handle potential null values safely
//   if (prodIdInput && csrfToken) {
//     const prodId = prodIdInput.value;
//     const csrf = csrfToken.value;

//     const productElement = btn.closest('article');
//     // Ensure productElement is not null and is an HTMLElement before proceeding.
//     if (productElement instanceof HTMLElement) {
//       try {
//         const response = await fetch('/admin/product/' + prodId, {
//           method: 'DELETE',
//           headers: {
//             'csrf-token': csrf,
//           },
//         });

//         const data = await response.json();
//         console.log(data);

//         // Use optional chaining for parentNode in case it's null
//         productElement.parentNode?.removeChild(productElement);
//       } catch (err) {
//         // Handle any errors that occur during the fetch
//         console.error(err);
//       }
//     }
//   }
// };

window.addEventListener('DOMContentLoaded', (event) => {
  document.querySelectorAll('.btn').forEach((button) => {
    (button as HTMLButtonElement).addEventListener('click', function () {
      deleteProduct.call(this);
    });
  });
});

async function deleteProduct(this: HTMLButtonElement) {
  console.log('Delete button clicked'); // Check if this logs in the console

  const prodIdInput = this.parentNode?.querySelector(
    '[name=productId]'
  ) as HTMLInputElement | null;
  const csrfInput = this.parentNode?.querySelector(
    '[name=_csrf]'
  ) as HTMLInputElement | null;

  if (!prodIdInput || !csrfInput) {
    console.error('Product ID or CSRF token not found');
    return;
  }

  const prodId = prodIdInput.value;
  const csrf = csrfInput.value;
  console.log(`Product ID: ${prodId}, CSRF Token: ${csrf}`); // Confirm values are correct

  if (!prodId || !csrf) {
    console.error('Product ID or CSRF token is empty');
    return;
  }

  const productElement = this.closest('article');
  if (!productElement) {
    console.error('Product element not found');
    return;
  }

  try {
    const response = await fetch(`/admin/product/${prodId}`, {
      method: 'DELETE',
      headers: {
        'csrf-token': csrf,
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Response data:', data); // Check server response
    productElement.remove();
  } catch (err) {
    console.error('Failed to delete product:', err);
  }
}
