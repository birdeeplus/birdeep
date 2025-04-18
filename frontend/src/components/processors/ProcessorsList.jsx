import { FaTrash, FaEdit } from "react-icons/fa";

export default function ProcessorsList({ language, processors, handleDelete, handleEdit }) {
    return (
        <table className="text-[#375B38] text-center w-full mt-8 rounded-lg overflow-hidden">
            <thead>
                <tr className="bg-gray-200">
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">{language === "en" ? "Model" : "Modelo"}</th>
                    <th className="px-4 py-2">{language === "en" ? "Comment" : "Comentario"}</th>
                    <th className="px-4 py-2">{language === "en" ? "ID Recorder" : "ID Grabadora"}</th>
                    <th className="px-4 py-2">{language === "en" ? "Delete" : "Eliminar"}</th>
                    <th className="px-4 py-2">{language === "en" ? "Modify" : "Modificar"}</th>
                </tr>
            </thead>
            <tbody>
                {processors.length > 0 ? (
                    processors.map((processor, index) => (
                        <tr key={processor.id_processor ?? `temp-${index}`} className="px-4 py-2 rounded-l-lg">
                            <td className="px-4 py-2">{processor.id_processor}</td>
                            <td className="px-4 py-2">{processor.model_processor}</td>
                            <td className="px-4 py-2">
                                {processor.comment_processor || (language === "en" ? "No comments" : "Sin comentarios")}
                            </td>
                            <td className="px-4 py-2">
                                {processor.id_recorder || (language === "en" ? "Not assigned" : "No asignado")}
                            </td>
                            <td className="text-center">
                                <button
                                    onClick={() => handleDelete(processor.id_processor)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash />
                                </button>
                            </td>
                            <td className="text-center">
                                <button
                                    onClick={() => handleEdit(processor)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <FaEdit />
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center py-2">
                            {language === "en" ? "No processors available" : "No hay procesadores disponibles"}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
