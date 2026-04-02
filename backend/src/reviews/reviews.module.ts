import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review, ReviewSchema } from './schemas/review.schema';
import { Doctor, DoctorSchema } from '../doctors/schemas/doctor.schema';
@Module({
  imports: [MongooseModule.forFeature([{name:Review.name,schema:ReviewSchema},{name:Doctor.name,schema:DoctorSchema}])],
  controllers: [ReviewsController], providers: [ReviewsService], exports: [ReviewsService],
})
export class ReviewsModule {}
