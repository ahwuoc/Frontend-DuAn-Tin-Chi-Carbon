"use client"; // nếu Next.js 13 app directory

import React, { useState } from "react";

export default function CreateProductPage() {
    const [name, setName] = useState("");
    const [type, setType] = useState<"carbon_credits" | "carbon_accounting" | "international_certificates">("carbon_credits");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState<number | "">("");
    const [status, setStatus] = useState<"active" | "pending" | "expired">("active");
    const [billingCycle, setBillingCycle] = useState("monthly");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    type,
                    description,
                    price: price === "" ? undefined : price,
                    status,
                    billingCycle,
                    accountManager: { name: "Default", email: "default@example.com", phone: "123456789" }, // fake data cho bắt buộc
                    purchaseDate: new Date().toISOString(),
                }),
            });
            if (!res.ok) throw new Error("Failed to create product");
            setMessage("Product created successfully!");
            // reset form
            setName("");
            setDescription("");
            setPrice("");
            setType("carbon_credits");
            setStatus("active");
            setBillingCycle("monthly");
        } catch (error: any) {
            setMessage(error.message || "Error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
            <h1>Create Product</h1>
            <form onSubmit={handleSubmit}>
                <label>Name:</label>
                <input value={name} onChange={e => setName(e.target.value)} required />

                <label>Type:</label>
                <select value={type} onChange={e => setType(e.target.value as any)} required>
                    <option value="carbon_credits">Carbon Credits</option>
                    <option value="carbon_accounting">Carbon Accounting</option>
                    <option value="international_certificates">International Certificates</option>
                </select>

                <label>Description:</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required />

                <label>Price:</label>
                <input
                    type="number"
                    value={price}
                    onChange={e => setPrice(e.target.value === "" ? "" : Number(e.target.value))}
                    min={0}
                    step={0.01}
                />

                <label>Status:</label>
                <select value={status} onChange={e => setStatus(e.target.value as any)} required>
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                </select>

                <label>Billing Cycle:</label>
                <input value={billingCycle} onChange={e => setBillingCycle(e.target.value)} required />

                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create"}
                </button>
            </form>

            {message && <p>{message}</p>}
        </div>
    );
}
