document.addEventListener("DOMContentLoaded", () => {
    const clickableRegions = document.querySelectorAll('.clickable');
    const sidebar = document.getElementById('sidebar');
    const infoTitle = document.getElementById('info-title');
    const infoDescription = document.getElementById('info-description');
    const closeBtn = document.getElementById('close-btn');
  
    clickableRegions.forEach(region => {
      region.addEventListener('click', () => {
        const title = region.getAttribute('data-title');
        const description = region.getAttribute('data-description');
  
        infoTitle.textContent = title;
        infoDescription.textContent = description;
        sidebar.style.display = 'block';
      });
    });
  
    closeBtn.addEventListener('click', () => {
      sidebar.style.display = 'none';
    });
  });
  