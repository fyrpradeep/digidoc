import { Injectable } from '@nestjs/common';
import { DoctorsService }   from '../doctors/doctors.service';
import { PatientsService }  from '../patients/patients.service';
import { OrdersService }    from '../orders/orders.service';
import { MedicinesService } from '../medicines/medicines.service';
@Injectable()
export class AdminService {
  constructor(
    private doctors:   DoctorsService,
    private patients:  PatientsService,
    private orders:    OrdersService,
    private medicines: MedicinesService,
  ) {}
  getDashboardStats() {
    return Promise.all([
      this.doctors.findAll(),
      this.patients.findAll(),
      this.orders.findPending(),
      this.doctors.findPending(),
    ]).then(([doctors, patients, pendingOrders, pendingDoctors]) => ({
      totalDoctors:    doctors.length,
      totalPatients:   patients.length,
      pendingOrders:   pendingOrders.length,
      pendingApprovals: pendingDoctors.length,
    }));
  }
  getPendingDoctors()     { return this.doctors.findPending(); }
  approveDoctor(id: string) { return this.doctors.approve(id); }
  rejectDoctor(id: string)  { return this.doctors.reject(id); }
  suspendDoctor(id: string) { return this.doctors.suspend(id); }
  getAllPatients()           { return this.patients.findAll(); }
  getAllOrders()             { return this.orders.findAll(); }
  dispatchOrder(id: string, trackingNo: string) { return this.orders.dispatch(id, trackingNo); }
  addMedicine(data: any)     { return this.medicines.create(data); }
  updateMedicine(id: string, data: any) { return this.medicines.update(id, data); }
  removeMedicine(id: string) { return this.medicines.remove(id); }
}
