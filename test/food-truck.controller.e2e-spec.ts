import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import * as request from 'supertest';
import { FoodTruckController } from '@/modules/food-truck/food-truck.controller';
import { FoodTruckService } from '@/modules/food-truck/food-truck.service';
import { JwtGuard } from '@/common/guard/jwt.guard';
import { CreateFoodTruckDto } from '@/modules/food-truck/dto/create-food-truck.dto';
import { UpdateFoodTruckDto } from '@/modules/food-truck/dto/update-food-truck.dto';

// Mock service with Jest spy functions
const mockFoodTruckService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

// Mock guard
class MockGuard implements CanActivate {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  canActivate(context: ExecutionContext): boolean {
    return true;
  }
}

describe('FoodTruckController (Integration Test)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [FoodTruckController],
      providers: [FoodTruckService],
    })
      .overrideProvider(FoodTruckService)
      .useValue(mockFoodTruckService)
      .overrideGuard(JwtGuard)
      .useClass(MockGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // Clear mocks before each test
  beforeEach(() => {
    mockFoodTruckService.create.mockClear();
    mockFoodTruckService.findAll.mockClear();
    mockFoodTruckService.findOne.mockClear();
    mockFoodTruckService.update.mockClear();
    mockFoodTruckService.remove.mockClear();
  });

  it('/food-trucks (GET) - should return all food trucks', () => {
    const mockFoodTrucks = [
      { id: 1, name: 'Truck A', user_id: 'user1' },
      { id: 2, name: 'Truck B', user_id: 'user2' },
    ];

    mockFoodTruckService.findAll.mockResolvedValue(mockFoodTrucks);

    return request(app.getHttpServer())
      .get('/food-trucks')
      .expect(200)
      .then((response) => {
        expect(mockFoodTruckService.findAll).toHaveBeenCalled();
        expect(response.body).toEqual(mockFoodTrucks);
      });
  });

  it('/food-trucks/:id (GET) - should return a single food truck', () => {
    const foodTruckId = 1;
    const mockFoodTruck = {
      id: foodTruckId,
      name: 'Single Truck',
      user_id: 'user1',
    };

    mockFoodTruckService.findOne.mockResolvedValue(mockFoodTruck);

    return request(app.getHttpServer())
      .get(`/food-trucks/${foodTruckId}`)
      .expect(200)
      .then((response) => {
        expect(mockFoodTruckService.findOne).toHaveBeenCalledWith(foodTruckId);
        expect(response.body).toEqual(mockFoodTruck);
      });
  });

  it('/food-trucks (POST) - should create and return new food truck', () => {
    const createDto: CreateFoodTruckDto = {
      name: 'Mocked Truck',
      user_id: 'any_user_id_works_now',
      description: 'a little description',
      cover_photo: 'cover.png',
    };

    mockFoodTruckService.create.mockResolvedValue({
      id: 1,
      ...createDto,
      created_at: new Date(),
    });

    return request(app.getHttpServer())
      .post('/food-trucks')
      .send(createDto)
      .expect(201)
      .then((response) => {
        expect(mockFoodTruckService.create).toHaveBeenCalledWith(createDto);
        expect(response.body.name).toEqual('Mocked Truck');
      });
  });

  it('/food-trucks/:id (PATCH) - should update and return food truck', () => {
    const foodTruckId = 1;
    const updateDto: UpdateFoodTruckDto = {
      name: 'Updated Truck Name',
    };

    const mockUpdatedFoodTruck = {
      id: foodTruckId,
      name: 'Updated Truck Name',
      user_id: 'user1',
    };

    mockFoodTruckService.update.mockResolvedValue(mockUpdatedFoodTruck);

    return request(app.getHttpServer())
      .patch(`/food-trucks/${foodTruckId}`)
      .send(updateDto)
      .expect(200)
      .then((response) => {
        expect(mockFoodTruckService.update).toHaveBeenCalledWith(
          foodTruckId,
          updateDto,
        );
        expect(response.body.name).toEqual('Updated Truck Name');
      });
  });

  it('/food-trucks/:id (DELETE) - should delete food truck and return 204', async () => {
    const foodTruckId = 123;

    mockFoodTruckService.remove.mockResolvedValue(undefined);

    await request(app.getHttpServer())
      .delete(`/food-trucks/${foodTruckId}`)
      .expect(204);

    expect(mockFoodTruckService.remove).toHaveBeenCalledWith(foodTruckId);
  });
});
