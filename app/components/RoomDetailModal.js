// components/RoomDetailModal.js
export default function RoomDetailModal({ isOpen, onClose, room }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Detalhes da Sala</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Sala" value={room.name} />
            <DetailItem label="Dia" value={room.days} />
            <DetailItem label="Turno" value={room.shift} />
            <DetailItem label="Unidade" value={room.unidade} />
            <DetailItem label="Curso" value={room.curso} />
            <DetailItem label="Período" value={room.periodo} />
            <DetailItem label="Disciplina" value={room.disciplina} />
            <DetailItem label="Docente" value={room.docente} />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value || '-'}</dd>
    </div>
  );
}