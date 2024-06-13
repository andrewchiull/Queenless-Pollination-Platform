
function changePage(pageId) {
    // hide all pages
    var pages = document.querySelectorAll('.page');
    pages.forEach(function(page) {
      page.style.display = 'none';
    });
  
    // 顯示所選分頁
    var selectedPage = document.getElementById(pageId);
    if (selectedPage) {
      selectedPage.style.display = 'block';
    }
  }
