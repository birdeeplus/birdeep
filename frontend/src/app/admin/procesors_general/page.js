"use client";
import { useState, useEffect } from "react";
import Navbar from "../../../components/navbars/Navbar_general";
import { FaEdit } from "react-icons/fa";
import Image from "next/image";
import AddProcessorPopup from "../../../components/procesors/AddProcesorPopup";
import EditProcessorPopup from "../../../components/procesors/EditProcesorPopup";
import ProcessorInfoModal from "../../../components/procesors/ProcessorInfoModal";

export default function ProcessorsGeneral() {
    const [language, setLanguage] = useState("en");
    const [processors, setProcessors] = useState([]);
    const [recorders, setRecorders] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [formData, setFormData] = useState({
        model_processor: "Orange Pi 3",
        comment_processor: "",
        id_recorder: ""
    });
    const [editFormData, setEditFormData] = useState(null);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);

    const toggleLanguage = () => {
        const newLang = language === "en" ? "es" : "en";
        setLanguage(newLang);
        localStorage.setItem("language", newLang);
    };

    useEffect(() => {
        const savedLang = localStorage.getItem("language") || "es";
        setLanguage(savedLang);

        const updateAdminStatus = () => {
            const userRole = localStorage.getItem("is_admin");
            const isUserAdmin = userRole === "true";
            setIsAdmin(isUserAdmin);
            if (!isUserAdmin) {
                alert("No tienes acceso a esta página.");
                window.location.href = "/";
            }
        };

        updateAdminStatus();
        window.addEventListener("authChange", updateAdminStatus);
        return () => window.removeEventListener("authChange", updateAdminStatus);
    }, []);

    useEffect(() => {
        fetch("http://localhost:8080/api/v1/processors")
            .then((res) => res.json())
            .then(setProcessors);

        fetch("http://localhost:8080/api/v1/recorders")
            .then((res) => res.json())
            .then(setRecorders);
    }, []);

    const handleEdit = (processor) => {
        setEditFormData(processor);
        setShowEditForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("¿Seguro que deseas eliminar este procesador?")) return;
        await fetch(`http://localhost:8080/api/v1/processors/${id}`, { method: "DELETE" });
        setProcessors(prev => prev.filter(p => p.id_processor !== id));
    };

    return (
        <div className="relative w-full h-screen bg-[#F8F8F8]">
            <Navbar toggleLanguage={toggleLanguage} language={language} />
            <br />
            <div className="w-full max-w-screen-xl mx-auto sm:px-6 lg:px-8 mt-20 pb-36">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-[#375B38] text-4xl font-bold">
                        {language === "en" ? "Processors" : "Procesadores"}
                    </h1>

                    {isAdmin && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="border-2 border-[#375B38] text-[#375B38] px-4 py-1 rounded-full flex items-center gap-2 hover:bg-[#375B38] hover:text-white transition"
                        >
                            {language === "en" ? "add" : "añadir"}
                            <span className="text-lg">+</span>
                        </button>
                    )}
                </div>

                <p className="italic text-sm text-gray-500 mt-10 mb-4">
                    {language === "en" ? "all processors" : "todos los procesadores"}
                </p>

                <div className="flex flex-col gap-2 w-full">
                    {processors.map((proc) => (
                        <div
                            key={proc.id_processor}
                            className="flex justify-between items-center px-4 py-2 rounded-xl transition hover:bg-white"
                        >
                            <button
                                onClick={() => setSelectedInfo(proc)}
                                className="flex items-center gap-2 font-medium px-6 py-2 rounded-xl transition-all bg-white text-[#375B38] hover:bg-[#375B38] hover:text-white"
                            >
                                {language === "en" ? "processor" : "procesador"} #{proc.id_processor}
                            </button>

                            <div className="flex items-center gap-4 text-[#375B38]">
                                {isAdmin && (
                                    <>
                                        <button
                                            onClick={() => handleEdit(proc)}
                                            className="hover:text-blue-600"
                                            title="Modificar"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(proc.id_processor)}
                                            className="hover:opacity-70"
                                            title="Eliminar"
                                        >
                                            <Image src="/iconos/eliminar.png" alt="Eliminar" width={18} height={18} />
                                        </button>
                                    </>
                                )}
                                <button
                                    onClick={() => setSelectedInfo(proc)}
                                    title="Información"
                                >
                                    <Image src="/iconos/info.png" alt="info" width={16} height={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {showForm && (
                    <AddProcessorPopup
                        showForm={showForm}
                        setShowForm={setShowForm}
                        formData={formData}
                        handleChange={(e) =>
                            setFormData({ ...formData, [e.target.name]: e.target.value })
                        }
                        handleSubmit={async (e) => {
                            e.preventDefault();
                            const newProc = {
                                ...formData,
                                id_recorder: Number(formData.id_recorder)
                            };
                            const res = await fetch("http://localhost:8080/api/v1/processors", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(newProc)
                            });
                            const saved = await res.json();
                            setProcessors(prev => [...prev, saved]);
                            setShowForm(false);
                            setFormData({
                                model_processor: "Orange Pi 3",
                                comment_processor: "",
                                id_recorder: ""
                            });
                        }}
                        recorders={recorders}
                        language={language}
                    />
                )}

                {showEditForm && (
                    <EditProcessorPopup
                        showEditForm={showEditForm}
                        editFormData={editFormData}
                        setEditFormData={setEditFormData}
                        setShowEditForm={setShowEditForm}
                        handleUpdate={async (e) => {
                            e.preventDefault();
                            await fetch(
                                `http://localhost:8080/api/v1/processors/${editFormData.id_processor}`,
                                {
                                    method: "PUT",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify(editFormData)
                                }
                            );
                            setProcessors(prev =>
                                prev.map(p => p.id_processor === editFormData.id_processor ? editFormData : p)
                            );
                            setShowEditForm(false);
                        }}
                        recorders={recorders}
                        language={language}
                    />
                )}

                {selectedInfo && (
                    <ProcessorInfoModal
                        processor={selectedInfo}
                        onClose={() => setSelectedInfo(null)}
                        language={language}
                        recorder={
                            recorders.find(r => r.id_recorder === selectedInfo.id_recorder) || null
                        }
                    />
                )}
            </div>
        </div>
    );
}
