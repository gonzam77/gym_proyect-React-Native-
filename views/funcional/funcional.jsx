import Rutinas from '../rutinas/rutinas';
import { TIPO_FUNCIONAL } from '../../helpers/funcional';

/**
 * Pestaña "Funcional": mis funcionales y los asignados por el coach. Es la
 * misma pantalla que Rutinas, filtrada por tipo, para que las dos se manejen
 * igual (segmentos, aviso de cambios del coach, reordenar).
 */
const Funcional = () => <Rutinas tipo={TIPO_FUNCIONAL} />;

export default Funcional;
