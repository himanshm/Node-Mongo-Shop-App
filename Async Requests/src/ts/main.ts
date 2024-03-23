const backdrop = document.querySelector('.backdrop') as HTMLElement;
const sideDrawer = document.querySelector('.mobile-nav') as HTMLElement;
const menuToggle = document.querySelector('#side-menu-toggle') as HTMLElement;

function backdropClickHandler(): void {
  // Check if backdrop is not null before accessing its style property
  if (backdrop) {
    backdrop.style.display = 'none';
    sideDrawer.classList.remove('open');
  }
}

function menuToggleClickHandler(): void {
  // Check if sideDrawer is not null before modifying it
  if (sideDrawer && backdrop) {
    backdrop.style.display = 'block';
    sideDrawer.classList.add('open');
  }
}

// Before adding event listeners, ensure the elements are not null
if (backdrop) {
  backdrop.addEventListener('click', backdropClickHandler);
}

if (menuToggle) {
  menuToggle.addEventListener('click', menuToggleClickHandler);
}
