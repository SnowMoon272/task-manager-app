# Profile Modals

Esta carpeta contiene todos los modales relacionados con el perfil del usuario, organizados de manera modular y reutilizable.

## Estructura

```
modals/
├── index.ts                    # Exportaciones centralizadas
├── ChangePasswordModal.tsx    # Modal principal de cambio de contraseña
├── ModalBase.tsx              # Componente base para modales
├── PasswordInput.tsx          # Input de contraseña con toggle de visibilidad
├── StatusMessage.tsx          # Componente para mensajes de estado
├── ModalActions.tsx           # Botones de acción del modal
└── usePasswordValidation.ts   # Hook para validación de contraseñas
```

## Componentes

### ChangePasswordModal

Modal principal para cambio de contraseñas, compuesto por varios componentes reutilizables.

**Props:**

- `isOpen: boolean` - Controla la visibilidad del modal
- `onClose: () => void` - Función para cerrar el modal
- `onSave: (currentPassword: string, newPassword: string) => Promise<void>` - Función para guardar la nueva contraseña

**Uso:**

```tsx
import { ChangePasswordModal } from "@/components/profile/modals";

<ChangePasswordModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSave={handleSavePassword}
/>;
```

### ModalBase

Componente base reutilizable para crear modales con animaciones consistentes.

**Props:**

- `isOpen: boolean` - Controla la visibilidad
- `onClose: () => void` - Función de cierre
- `title: string` - Título del modal
- `children: React.ReactNode` - Contenido del modal
- `maxWidth?: string` - Ancho máximo (default: "max-w-md")

### PasswordInput

Campo de entrada de contraseña con funcionalidad de mostrar/ocultar.

**Props:**

- `id: string` - ID del input
- `label: string` - Etiqueta del campo
- `placeholder: string` - Texto placeholder
- `value: string` - Valor actual
- `onChange: (value: string) => void` - Función de cambio
- `disabled?: boolean` - Estado deshabilitado
- `required?: boolean` - Campo requerido

### StatusMessage

Componente para mostrar mensajes de error o éxito.

**Props:**

- `error?: string` - Mensaje de error
- `success?: string` - Mensaje de éxito
- `className?: string` - Clases CSS adicionales

### ModalActions

Botones de acción estándar para modales (Cancelar/Guardar).

**Props:**

- `onCancel: () => void` - Función de cancelación
- `onSubmit: () => void` - Función de envío
- `isLoading: boolean` - Estado de carga
- `submitText: string` - Texto del botón de envío
- `loadingText: string` - Texto durante la carga
- `cancelText?: string` - Texto del botón cancelar

## Hook

### usePasswordValidation

Hook personalizado que maneja toda la lógica de validación y estado para el cambio de contraseñas.

**Parámetros:**

- `onSave: (current: string, new: string) => Promise<void>` - Función de guardado
- `onClose: () => void` - Función de cierre

**Retorna:**

- Estados de los campos de contraseña
- Funciones para actualizar los estados
- Estados de error, éxito y carga
- Función de manejo de submit
- Funciones de utilidad (clearMessages, resetForm)

## Validaciones Incluidas

- Contraseña actual requerida
- Nueva contraseña requerida
- Mínimo 6 caracteres
- Confirmación de contraseña
- Nueva contraseña diferente a la actual

## Características

- ✅ **Modular**: Componentes reutilizables
- ✅ **Type Safe**: Completamente tipado con TypeScript
- ✅ **Responsive**: Diseño adaptable
- ✅ **Animado**: Transiciones suaves
- ✅ **Accesible**: Labels y estados apropiados
- ✅ **Validación**: Validaciones comprensivas
- ✅ **Loading States**: Estados de carga manejados
- ✅ **Error Handling**: Manejo robusto de errores

