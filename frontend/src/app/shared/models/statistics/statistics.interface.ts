export interface IMainStatistics {
  id: number;
  name: string;
  value: number;
}
export interface IMonthlySales {
  date: string;
  value: number;
}
export interface ILastUsers {
  id: string;
  name: string;
  email: string;
  picture: string;
  total: number;
}
export interface IMiddleStatistics{
    monthlySales: IMonthlySales[];
    lastUsers:ILastUsers[]
}
export interface IManagerDashboard {
    todayOrders: number,
    revenue: number,
    pending: number,
    ready: number,
    processing: number,
    delivery: number,
    completed: number
}