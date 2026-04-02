import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from './schemas/notification.schema';
@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private model: Model<Notification>) {}
  create(data:any)              { return this.model.create(data); }
  findByUser(id:string)         { return this.model.find({userId:id}).sort({createdAt:-1}).limit(50).lean(); }
  markRead(id:string)           { return this.model.updateOne({_id:id},{isRead:true}); }
  markAllRead(userId:string)    { return this.model.updateMany({userId,isRead:false},{isRead:true}); }
  unreadCount(userId:string)    { return this.model.countDocuments({userId,isRead:false}); }
}
