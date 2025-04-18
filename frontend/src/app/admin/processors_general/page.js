"use client";
import { useState, useEffect } from "react";
import Navbar from "../../../components/navbars/Navbar_general";
import { FaEdit } from "react-icons/fa";
import Image from "next/image";
import AddProcessorPopup from "../../../components/processors/AddProcessorPopup";
import EditProcessorPopup from "../../../components/processors/EditProcessorPopup";
import DeleteProcessorModal from "../../../components/processors/DeleteProcessorModal";


export default function ProcessorsTable() {
    const [language, setLanguage] = useState("en");
    const [processors, setProcessors] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        model_processor: "AudioMoth",
        comment_processor: "",
        id_recorder: ""
    });
    const [showEditForm, setShowEditForm] = useState(false);
    const [editFormData, setEditFormData] = useState(null);
    const [recorders, setRecorders] = useState([]);
    const [selectedInfo, setSelectedInfo] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [procToDelete, setProcToDelete] = useState(null);


    const toggleLanguage = () => {
        const newLang = language === "en" ? "es" : "en";
        setLanguage(newLang);
        localStorage.setItem("language", newLang);
    };

    useEffect(() => {
        const savedLanguage = localStorage.getItem("language") || "es";
        setLanguage(savedLanguage);

        const updateAdminStatus = () => {
            const userRole = localStorage.getItem("is_admin");
            const isUserAdmin = userRole === "true";
            setIsAdmin(isUserAdmin);

            if (!isUserAdmin) {
                alert(language === "es" ? "No tienes acceso a esta página." : "You do not have access to this page.");
                window.location.href = "/";
            }
        };

        updateAdminStatus();

        const handleAuthChange = () => {
            updateAdminStatus();
        };

        window.addEventListener("authChange", handleAuthChange);
        return () => {
            window.removeEventListener("authChange", handleAuthChange);
        };
    }, [language]);


    useEffect(() => {
        fetch("http://localhost:8080/api/v1/processors")
            .then((res) => res.json())
            .then(setProcessors);

        fetch("http://localhost:8080/api/v1/recorders")
            .then((res) => res.json())
            .then(setRecorders);
    }, []);

    const handleEdit = (proc) => {
        setEditFormData(proc);
        setShowEditForm(true);
    };

    const handleDeleteClick = (proc) => {
        setProcToDelete(proc);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!procToDelete) return;
        await fetch(`http://localhost:8080/api/v1/processors/${procToDelete.id_processor}`, {
            method: "DELETE"
        });
        setProcessors((prev) => prev.filter((m) => m.id_processor !== procToDelete.id_processor));
        setShowDeleteModal(false);
        setProcToDelete(null);
    };

    return (
        <div className="relative w-full min-h-screen bg-[#F8F8F8]">
            <Navbar toggleLanguage={toggleLanguage} language={language} />
            <br />
            <div className="w-full max-w-screen-xl mx-auto sm:px-6 lg:px-8 mt-20">
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

                <div className="flex flex-col gap-2 w-full pb-28">
                    {processors.map((proc) => (
                        <div
                            key={proc.id_processor}
                            className="flex justify-between items-center px-4 py-2 rounded-xl transition hover:bg-white"
                        >
                            <button
                                onClick={() => {
                                    setEditFormData(proc);
                                    setShowEditForm(true);
                                }}
                                className="flex items-center gap-2 font-medium px-6 py-2 rounded-xl transition-all bg-white text-[#375B38] hover:bg-[#375B38] hover:text-white"
                            >
                                {language === "en" ? "processor" : "procesador"} #{proc.id_processor}
                            </button>

                            <div className="flex items-center gap-4 text-[#375B38]">
                                {isAdmin && (
                                    <>
                                        {/* eliminar el botón de editar */}
                                        <button
                                            onClick={() => handleDeleteClick(proc)}
                                            className="hover:opacity-70"
                                            title="Eliminar"
                                        >
                                            <Image src="/iconos/eliminar.png" alt="Eliminar" width={18} height={18} />
                                        </button>

                                    </>
                                )}
                                <button
                                    onClick={() => {
                                        setEditFormData(proc);
                                        setShowEditForm(true);
                                    }}
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
                        language={language}
                        recorders={recorders}
                        formData={formData}
                        handleChange={(e) =>
                            setFormData({ ...formData, [e.target.name]: e.target.value })
                        }
                        handleSubmit={async (e) => {
                            e.preventDefault();
                            const newProc = { ...formData, id_recorder: Number(formData.id_recorder) };
                            const res = await fetch("http://localhost:8080/api/v1/processors", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(newProc),
                            });
                            const saved = await res.json();
                            setProcessors(prev => [...prev, saved]);
                            setShowForm(false);
                            setFormData({ model_processor: "AudioMoth", comment_processor: "", id_recorder: "" });
                        }}
                    />
                )}

                {showEditForm && (
                    <EditProcessorPopup
                        showEditForm={showEditForm}
                        setShowEditForm={setShowEditForm}
                        language={language}
                        formData={editFormData}
                        handleChange={(e) =>
                            setEditFormData({ ...editFormData, [e.target.name]: e.target.value })
                        }
                        handleSubmit={async (e) => {
                            e.preventDefault();
                            await fetch(`http://localhost:8080/api/v1/processors/${editFormData.id_processor}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(editFormData),
                            });
                            setProcessors((prev) =>
                                prev.map((m) => m.id_processor === editFormData.id_processor ? editFormData : m)
                            );
                            setShowEditForm(false);
                            setEditFormData(null);
                        }}
                        recorders={recorders}
                    />
                )}

                {showDeleteModal && (
                    <DeleteProcessorModal
                        isOpen={showDeleteModal}
                        onClose={() => setShowDeleteModal(false)}
                        onConfirm={confirmDelete}
                        language={language}
                    />
                )}

            </div>
        </div>
    );
}
