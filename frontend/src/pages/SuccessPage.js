import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "../config/apiBase.js";
import generatePDF from "../utils/generatePDF";
import Invoice from "../component/Invoice";


const SuccessPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/payment/receipt/${id}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) {
          throw new Error(json?.error || "Failed to load receipt");
        }
        return json;
      })
      .then(setData)
      .catch((e) => setError(e.message || "Failed to load receipt"));
  }, [id]);

  if (error) return <div>{error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <>
     <div className="p-6 flex flex-col items-center">

      <Invoice data={data} />

      <div className="flex gap-3 mt-4">

        <button onClick={() => window.print()}
          className="text-white rounded">
          Print
        </button>

        <button onClick={() => generatePDF(data)}
          className="text-white rounded success-btn">
          Download PDF
        </button>

      </div>
    </div>
    </>
   
  );
};

export default SuccessPage;
