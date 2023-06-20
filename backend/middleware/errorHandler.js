// errorHandler middleware
const errorHandler = (err, req, res, next) => {
  // Varsayılan hata mesajı ve kodu
  let message = "Something went wrong. Please try again.";
  let code = 500;

  // Kontrolcü tarafından fırlatılan hata mesajını ve kodunu kontrol etme
  if (err.message && err.code) {
    message = err.message;
    code = err.code;
  }

  // Hata nesnesini ve HTTP durum kodunu yanıt olarak döndürme
  res.status(code).json({ error: message });
};

module.exports = errorHandler;
