import { FaTrash, FaEdit } from "react-icons/fa";

export default function ProcessorsList({ processors, language, handleDelete, handleEdit }) {
    return (
        <table className="text-[#375B38] w-full mt-8 rounded-lg overflow-hidden">
            <thead>
                <tr className="bg-gray-200">
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py">{language === "en" ? "Model" : "Modelo"}</th>
                    <th className="px-4 py">{language === "en" ? "Comment" : "Comentario"}</th>
                    <th className="px-4 py">{language === "en" ? "ID Recorder" : "ID Grabadora"}</th>
                    <th className="px-4 py">{language === "en" ? "Delete" : "Eliminar"}</th>
                    <th className="px-4 py">{language === "en" ? "Edit" : "Modificar"}</th>
                </tr>
            </thead>
            <tbody>
                {processors.length > 0 ? (
                    processors.map((processor) => (
                        <tr key={processor.id_processor} className="text-center cursor-pointer hover:bg-gray-100">
                            <td className="px-4 py-2 rounded-l-lg">{processor.id_processor}</td>
                            <td className="px-4 py-2">{processor.model_processor}</td>
                            <td className="px-4 py-2">
                                {processor.comment_processor || (language === "en" ? "No comments" : "Sin comentarios")}
                            </td>
                            <td className="px-4 py-2">
                                {processor.id_recorder ? processor.id_recorder : (language === "en" ? "Not assigned" : "No asignado")}
                            </td>
                            <td className="px-4 py-2">
                                <button onClick={() => handleDelete(processor.id_processor)} className="text-black hover:text-black">
                                    <FaTrash />
                                </button>
                            </td>
                            <td className="px-4 py-2">
                                <button onClick={() => handleEdit(processor)} className="text-black hover:text-black">
                                    <FaEdit />
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center p-4">
                            {language === "en" ? "There are no registered processors." : "No hay procesadores registrados."}
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}
