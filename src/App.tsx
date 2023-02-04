import React, { useState, useEffect } from "react";
import axios from "axios";

const API_ENDPOINT = "https://reqres.in/api/products";
interface Props {
  product: Product | null;
  onClose: () => void;
}

const Modal = (props: Props) => {
  const { product, onClose } = props;

  if (!product) {
    return null;
  }

  const handleCloseClick = () => {
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button onClick={handleCloseClick}>Close</button>
        <div>
          <h3>{product.name}</h3>
          <p>{`ID: ${product.id}`}</p>
          <p>{`Year: ${product.year}`}</p>
          <p>{`Color: ${product.color}`}</p>
        </div>
      </div>
    </div>
  );
};
interface Props {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = (props: Props) => {
  const { totalPages, currentPage, onPageChange } = props;

  const handlePreviousClick = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination">
      <button onClick={handlePreviousClick} disabled={currentPage === 1}>
        &lt;
      </button>
      <span>{`Page ${currentPage} of ${totalPages}`}</span>
      <button onClick={handleNextClick} disabled={currentPage === totalPages}>
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
const App = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterId, setFilterId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    axios
      .get(API_ENDPOINT)
      .then((res) => {
        setProducts(res.data.data);
        setFilteredProducts(res.data.data);
      })
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    setFilteredProducts(
      products.filter((product) => product.id.toString().includes(filterId))
    );
  }, [filterId, products]);

  const handleFilterIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterId(e.target.value);
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  const handleModalClose = () => {
    setSelectedProduct(null);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <div>
      <input
        type="text"
        value={filterId}
        onChange={handleFilterIdChange}
        placeholder="Filter by id"
      />
      <table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((product: any) => (
            <tr
              key={product.id}
              style={{ backgroundColor: product.color }}
              onClick={() => handleProductClick(product)}
            >
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={filteredProducts.length}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
      {selectedProduct && (
        <Modal product={selectedProduct} onClose={handleModalClose} />
      )}
    </div>
  );
};

export default App;
