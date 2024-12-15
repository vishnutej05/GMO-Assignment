import { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber, InputNumberValueChangeEvent } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

// Datatype for API data
interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

export default function PaginatorBasicDemo() {
  const [data, setData] = useState<Artwork[]>([]); 
  const [totalRecords, setTotalRecords] = useState<number>(0); 
  const [selectedCustomers, setSelectedCustomers] = useState<Artwork[]>([]); 
  const [first, setFirst] = useState<number>(0); 
  const [selectCount, setSelectCount] = useState<number>(0);
  const op = useRef<OverlayPanel>(null);

  const fetchData = async (page: number): Promise<Artwork[]> => {
    try {
      const response = await fetch(
        `https://api.artic.edu/api/v1/artworks?page=${page}`
      );
      const result = await response.json();
      // console.log(result.pagination)
      return result.data as Artwork[];
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      const pageData = await fetchData(1);
      setData(pageData);
      setTotalRecords(126335);
    };
    fetchInitialData();
  }, []);

 
  const onPageChange = async (e: { page?: number; first: number }) => {
    const nextPage = e.page !== undefined ? e.page + 1 : 1;
    setFirst(e.first ?? 0);
    const pageData = await fetchData(nextPage);
    setData(pageData);
  };
  

  // Select rows programmatically across pages
  const handleSelectRows = async () => {
    let rowsToSelect: Artwork[] = [];
    let remainingRows = selectCount;
    let currentPage = 1;

    while (remainingRows > 0) {
      const pageData = await fetchData(currentPage);
      const rowsOnPage = pageData.slice(0, remainingRows);
      rowsToSelect = [...rowsToSelect, ...rowsOnPage];
      remainingRows -= rowsOnPage.length;
      currentPage++;
    }

    setSelectedCustomers(rowsToSelect);
  };

  return (
    <div className="card">
      {/* OverlayPanel for selecting rows */}
      <OverlayPanel ref={op}>
        <div style={{ display: "flex", gap: "10px" }}>
          <InputNumber
            value={selectCount}
            onValueChange={(e: InputNumberValueChangeEvent) =>
              setSelectCount(e.value || 0)
            }
            placeholder="Select rows..."
            min={0}
            max={totalRecords}
          />
          <Button label="Submit" onClick={handleSelectRows} />
        </div>
      </OverlayPanel>

      {/* DataTable */}
      <DataTable
        value={data}
        paginator
        rows={data.length}
        totalRecords={totalRecords}
        selectionMode="multiple"
        selection={selectedCustomers}
        onSelectionChange={(e) => setSelectedCustomers(e.value)}
        lazy
        onPage={onPageChange}
        dataKey="id"
        first={first}
        tableStyle={{ minWidth: "100rem" }}
      >
        {/* Column for checkboxes */}
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />

        {/* Dropdown icon in column header */}
        <Column
          header={
            <FontAwesomeIcon
              icon={faAngleDown}
              style={{
                cursor: "pointer",
                width: "24px",
                height: "24px",
              }}
              onClick={(e) => op.current?.toggle(e)}
            />
          }
          headerStyle={{ width: "3rem", textAlign: "center" }}
        />

        {/* Columns for API Data */}
        <Column field="title" header="Title" style={{ width: "20%" }} />
        <Column
          field="place_of_origin"
          header="Place of Origin"
          style={{ width: "20%" }}
        />
        <Column
          field="artist_display"
          header="Artist Display"
          style={{ width: "20%" }}
        />
        <Column
        field="inscriptions"
        header="Inscriptions"
        style={{ width: "20%" }}
        body={(rowData) => (rowData.inscriptions ? rowData.inscriptions : "No inscriptions given for this one")}
      />
        <Column
          field="date_start"
          header="Date Start"
          style={{ width: "10%" }}
        />
        <Column field="date_end" header="Date End" style={{ width: "10%" }} />
      </DataTable>
    </div>
  );
}
