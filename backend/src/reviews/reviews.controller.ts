import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
@Controller('reviews')
export class ReviewsController {
  constructor(private svc: ReviewsService) {}
  @Post()      create(@Body() b:any)            { return this.svc.create(b); }
  @Get()       findAll()                        { return this.svc.findAll(); }
  @Get(':id')  findByDoctor(@Param('id') id:string) { return this.svc.findByDoctor(id); }
}
