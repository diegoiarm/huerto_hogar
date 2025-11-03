// --- Validaciones y lógica del formulario ---
export const validateEmail = (email) => {
    const validDomains = ['duoc.cl', 'profesor.duoc.cl', 'gmail.com'];
    if (!email) return true; // El email es opcional según las reglas originales
    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) return false;

    return validDomains.some(domain => email.endsWith('@' + domain));
};

export const validateFormData = (formData) => {
    const errors = {};
    
    // Validación del nombre
    if (!formData.nombre.trim()) {
        errors.nombre = 'Por favor, ingresa tu nombre.';
    } else if (formData.nombre.length > 100) {
        errors.nombre = 'El nombre no puede superar los 100 caracteres.';
    }

    // Validación del email
    if (formData.email && !validateEmail(formData.email)) {
        errors.email = 'Solo se permiten correos @duoc.cl, @profesor.duoc.cl o @gmail.com';
    } else if (formData.email.length > 100) {
        errors.email = 'El correo no puede superar los 100 caracteres.';
    }

    // Validación del mensaje
    if (!formData.mensaje.trim()) {
        errors.mensaje = 'El mensaje no puede estar vacío.';
    } else if (formData.mensaje.length > 500) {
        errors.mensaje = 'El mensaje no puede superar los 500 caracteres.';
    }

    return errors;
};

// --- Estado inicial del formulario ---
export const initialFormState = {
    nombre: '',
    email: '',
    mensaje: ''
};

// --- Manejadores de eventos ---
export const handleFormSubmit = (e, formData, setFormData, setErrors, setValidated) => {
    e.preventDefault();
    setValidated(true);

    const validationErrors = validateFormData(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
        // Aquí podrías agregar la lógica para enviar el formulario a un servidor
        alert('Tu mensaje se ha enviado correctamente');
        setFormData(initialFormState);
        setValidated(false);
        setErrors({});
        return true;
    }
    return false;
};

export const handleInputChange = (e, formData, setFormData, validated, setErrors) => {
    const { name, value } = e.target;
    const newFormData = {
        ...formData,
        [name]: value
    };
    
    setFormData(newFormData);
    
    // Si el formulario ya fue validado una vez, validamos en tiempo real
    if (validated) {
        setErrors(validateFormData(newFormData));
    }
};