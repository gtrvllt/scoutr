export default function DonatePage() {
  return (
    <div className="py-12 px-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Donate</h1>
      <p className="text-gray-700 text-lg mb-6">Merci de soutenir le projet !</p>
      <div className="flex flex-col items-start">
        <img
          src="/paypal_qrcode_redd.png"
          alt="QR Code Paypal"
          className="w-48 h-48 mb-4 border rounded shadow"
        />
        <p className="text-gray-600 text-sm">Scannez ce QR code pour faire un don via Paypal</p>
      </div>
    </div>
  )
}