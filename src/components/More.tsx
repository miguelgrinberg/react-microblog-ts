import Button from 'react-bootstrap/Button';
import { Pagination } from '../Schemas';

type MoreProps = {
    pagination: Pagination;
    loadNextPage: () => void;
}

export default function More({ pagination, loadNextPage }: MoreProps) {
  let thereAreMore = false;
  if (pagination) {
    const { offset, count, total } = pagination;
    thereAreMore = offset + count < total;
  }

  return (
    <div className="More">
      {thereAreMore &&
        <Button variant="outline-primary" onClick={loadNextPage}>
          More &raquo;
        </Button>
      }
    </div>
  );
}