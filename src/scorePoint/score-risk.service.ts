import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Points } from '../scorePoint/entities/points.entity';

@Injectable()
export class ScoreRiskService {
  constructor(
    @InjectRepository(Points)
    private readonly pointsRepository: Repository<Points>,
  ) {}

  // Definir las reglas y puntajes para el riesgo de persona
  private readonly personRiskRules = {
    statusLastLincese: {
      suspendida: 80,
      cancelada: 80,
      noReportado: 68,
      retenida: 80,
      sinRegistro: 65,
      inActiva: 6.25,
      vencida: 20,
      activa: 0,
    },
    totalHighTrafficFine: {
      range: [
        { min: 0, max: 0, score: 0 },
        { min: 3, max: Infinity, score: 40 },
      ],
    },

    licenseMonthAgo: {
      range: [
        { min: 1, max: 6, score: 12.5 },
        { min: 24, max: 48, score: 3 },
        { min: 50, max: Infinity, score: 2 },
      ],
    },
  };

  // Definir las reglas y puntajes para el riesgo de vehículo
  private readonly vehicleRiskRules = {
    rtmExpiration: {
      vencida: 50,
      proxima: 6.25,
      vigente: 0,
    },
    soatExpiration: {
      vencido: 50,
      proximo: 6.255,
      vigente: 0,
    },
    NumberOwnersRecord: {
      range: [
        { min: 0, max: 2, score: 2 },
        { min: 3, max: Infinity, score: 12.5 },
      ],
    },
    foreclosure: {
      range: [
        { min: 0, max: 0, score: 0 },
        { min: 1, max: Infinity, score: 80 },
      ],
    },
    theft: {
      range: [
        { min: 0, max: 0, score: 0 },
        { min: 1, max: Infinity, score: 80 },
      ],
    },
  };

  // Definir las reglas y puntajes para el riesgo de vehículo y persona combinados
  private readonly combinedRiskRules = {
    totalScore: {
      age: {
        range: [
          { min: 18, max: 25, score: 8.33 },
          { min: 26, max: 64, score: 2 },
          { min: 65, max: 100, score: 4.165 },
        ],
      },
      brand: {
        Bajaj: 8.33,
        Hero: 8.33,
        Akt: 8.33,
        Honda: 8.33,
        Ktm: 8.33,
        Yamaha: 8.33,
      },
      lines: {
        boxer: 8.33,
        pulsar: 8.33,
        deluxei3s: 8.33,
        nkd: 8.33,
        tt: 8.33,
        ttr: 8.33,
        xr: 8.33,
        duke: 8.33,
        nmax: 8.33,
        xtz: 8.33,
      },
      cylinderCapacity: {
        range: [
          { min: 125, max: 250, score: 8.33 },
          { min: 255, max: 1250, score: 3 },
        ],
      },
      commercialValue: {
        range: [
          { min: 2000000, max: 2300000, score: 2 },
          { min: 2400000, max: 13400000, score: 8.33 },
          { min: 13450000, max: 14500000, score: 8.33 },
          { min: 14600000, max: 150000000, score: 2 },
        ],
      },
    },
  };

  // funcion para calcular los riesgos de manera individual
  calculateRisk = (
    values: { [x: string]: any },
    rules: { [x: string]: any },
  ) => {
    let score = 0;

    for (const category in rules) {
      const categoryRules = rules[category];
      const categoryValue = values[category];

      if (categoryValue !== undefined) {
        if (
          typeof categoryValue === 'string' &&
          categoryValue in categoryRules
        ) {
          score += categoryRules[categoryValue];
        } else if (typeof categoryValue === 'number') {
          if (categoryRules.hasOwnProperty('range')) {
            for (const range of categoryRules.range) {
              if (categoryValue >= range.min && categoryValue <= range.max) {
                score += range.score;
                break;
              }
            }
          }
        } else if (Array.isArray(categoryValue)) {
          // Si es un array, sumar los puntajes correspondientes
          for (const value of categoryValue) {
            const matchingRule = categoryRules.find(
              (rule: { value: any }) => rule.value === value,
            );
            if (matchingRule) {
              score += matchingRule.score;
            }
          }
        } else if (typeof categoryValue === 'object') {
          // Si es un objeto, sumar los puntajes de las propiedades
          for (const prop in categoryValue) {
            if (prop in categoryRules) {
              score += categoryRules[prop][categoryValue[prop]];
            }
          }
        }
      }
    }

    return score;
  };

  calculateTotalRisk = (data: {
    statusLastLincese: string;
    licenseMonthAgo: number;
    totalHighTrafficFine: string[];
    rtmExpiration: string;
    soatExpiration: string;
    NumberOwnersRecord: number;
    foreclosure: number;
    theft: number;
    age: number;
    brand: string;
    Line: string;
    cylinderCapacity: number;
    commercialValue: number;
  }) => {
    const {
      statusLastLincese,
      licenseMonthAgo,
      totalHighTrafficFine,
      rtmExpiration,
      soatExpiration,
      NumberOwnersRecord,
      foreclosure,
      theft,
      age,
      brand,
      Line,
      cylinderCapacity,
      commercialValue,
    } = data;

    const personRiskValues = {
      statusLastLincese,
      licenseMonthAgo,
      totalHighTrafficFine,
    };

    const vehicleRiskValues = {
      rtmExpiration,
      soatExpiration,
      NumberOwnersRecord,
      foreclosure,
      theft,
    };

    const combinedRiskValues = {
      age,
      brand,
      Line,
      cylinderCapacity,
      commercialValue,
    };

    const combinedRiskScore = this.calculateRisk(
      combinedRiskValues,
      this.combinedRiskRules.totalScore,
    );

    const personRiskScore = this.calculateRisk(
      personRiskValues,
      this.personRiskRules,
    );
    const vehicleRiskScore = this.calculateRisk(
      vehicleRiskValues,
      this.vehicleRiskRules,
    );

    let totalScore = personRiskScore + vehicleRiskScore + combinedRiskScore;

    // Ajusta el totalScore si es mayor que 98.9
    totalScore = totalScore > 98.9 ? 98.9 : totalScore;

    const numericAge = parseInt(age.toString());
    const numericDrivingLicense = parseInt(licenseMonthAgo.toString());

    // Manejo de valores no numéricos
    if (isNaN(numericAge) || isNaN(numericDrivingLicense)) {
      console.error('Valores no numéricos ingresados.');
      return;
    }

    const numericCylinderCapacity = parseInt(cylinderCapacity.toString());
    const numericCommercialValue = parseInt(commercialValue.toString());
    // Repite este proceso para todos los campos numéricos en vehicleRiskValues
    if (isNaN(numericCylinderCapacity) || isNaN(numericCommercialValue)) {
      // Manejo de valores no numéricos
      console.error('Valores no numéricos ingresados.');
      return;
    }

    // Devuelve el totalScore calculado
    return totalScore;
  };

  async findOne(totalScore: number): Promise<Points | null> {
    const points = await this.pointsRepository.findOne({
      where: { totalScore },
    });
    return points;
  }

  async createScore(totalScore: Points) {
    return await this.pointsRepository.save(totalScore);
  }
}
