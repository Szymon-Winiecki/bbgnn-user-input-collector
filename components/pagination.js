import style from './pagination.module.css'

export default function Pagination({ pagesCount, currentPage, shownAroundCount = 1, OnChangePage }) {

  function firstToShow(){
    return Math.max(1, currentPage - shownAroundCount);
  }

  function lastToShow(){
    return Math.min(pagesCount, currentPage + shownAroundCount);
  }

  function pagesToShow(){
    const pages = [];
    const start = firstToShow();
    const end = lastToShow();
    for(let i = start; i <= end; ++i){
      pages.push(i);
    }

    return pages;
  }
  
  return (
    <nav>
      <ul className="pagination">
        {currentPage > 1 &&
          <li className="page-item" onClick={() => OnChangePage(Math.max(1, currentPage - 1))}>
            <a className="page-link" href="#" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
        }
        {firstToShow() > 1 &&
        <>
          <li className='page-item' onClick={() => OnChangePage(1)} key={1}><a className="page-link" href="#">1</a></li>
          {firstToShow() > 2 && <li className='page-item' ><a className="page-link" href="#">...</a></li>}
        </>
        }
        {pagesToShow().map( (i) => <li className={`page-item ${i == currentPage && style.current}`} onClick={() => OnChangePage(i)} key={i}><a className="page-link" href="#">{i}</a></li>)}
        {lastToShow() < pagesCount &&
        <>
          {lastToShow() < pagesCount - 1 && <li className='page-item' ><a className="page-link" href="#">...</a></li>}
          <li className='page-item' onClick={() => OnChangePage(pagesCount)} key={pagesCount}><a className="page-link" href="#">{pagesCount}</a></li>
        </>
        }
        {currentPage < pagesCount &&
          <li className="page-item" onClick={() => OnChangePage(Math.min(pagesCount, currentPage + 1))}>
            <a className="page-link" href="#" aria-label="Next">
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        }
      </ul>
    </nav>
  );
}