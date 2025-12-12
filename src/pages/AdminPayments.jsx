import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, "payments"));
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setPayments(list);
    };
    load();
  }, []);

  return (
    <div style={{ padding: 40, color: "white" }}>
      <h1>Payments History</h1>

      <table style={{ width: "100%", marginTop: 20, color: "white" }}>
        <thead>
          <tr>
            <th>User</th>
            <th>Project</th>
            <th>Amount</th>
            <th>Payment ID</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {payments.map((p) => (
            <tr key={p.id}>
              <td>{p.email}</td>
              <td>{p.projectTitle}</td>
              <td>₹{p.amount}</td>
              <td>{p.paymentId}</td>
              <td>{p.createdAt?.toDate?.().toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
