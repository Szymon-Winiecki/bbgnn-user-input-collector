import style from './pagination.module.css'

export default function Pagination({ pagesCount, currentPage, shownAroundCount = 1, OnChangePage }) {

  function pagesToShow(){
    const pages = [];
    const start = Math.max(1, currentPage - shownAroundCount);
    const end = Math.min(pagesCount, currentPage + shownAroundCount);
    for(let i = start; i <= end; ++i){
      pages.push(i);
    }

    return pages;
  }
  
  return (
    <nav>
      <ul className="pagination">
        <li className="page-item" onClick={() => OnChangePage(Math.max(1, currentPage - 1))}>
          <a className="page-link" href="#" aria-label="Previous">
            <span aria-hidden="true">&laquo;</span>
          </a>
        </li>
        {pagesToShow().map( (i) => <li className={`page-item ${i == currentPage && style.current}`} onClick={() => OnChangePage(i)} key={i}><a className="page-link" href="#">{i}</a></li>)}
        <li className="page-item" onClick={() => OnChangePage(Math.min(pagesCount, currentPage + 1))}>
          <a className="page-link" href="#" aria-label="Next">
            <span aria-hidden="true">&raquo;</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}