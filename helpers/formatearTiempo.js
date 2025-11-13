const formatearTiempo = (segundos) => {
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        const seg = segundos % 60;

        return `${horas > 0 ? `${horas}h ` : ''}${minutos}m ${seg.toString().padStart(2, '0')}s`;
    };

export default formatearTiempo;