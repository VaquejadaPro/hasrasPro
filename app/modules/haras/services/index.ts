// Exportações dos serviços do módulo Haras
export { cavaloService } from './cavaloService';
export type { Cavalo, CavaloStats, CreateCavaloRequest, UpdateCavaloRequest } from './cavaloService';

export { baiaService } from './baiaService';
export type { Baia, BaiaStats, CreateBaiaRequest, UpdateBaiaRequest } from './baiaService';

export { embryoService } from './embryoService';
export type { Embryo } from './embryoService';

export { stockService } from './stockService';
export type { FeedStock, StockAlert, StockMovement, CreateStockDTO, UpdateStockDTO, StockMovementDTO } from '../types/stock';

export { veterinaryService } from './veterinaryService';
export type { Medicine, VeterinaryStock, VeterinaryAlert, HorseTreatment, CreateMedicineDTO, CreateVeterinaryStockDTO, CreateTreatmentDTO } from './veterinaryService';

export { harasService } from './harasService';
export { animalService } from './animalService';
