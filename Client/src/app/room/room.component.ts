import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HotelService } from '../shared/hotel.service';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';
export interface Room {
  roomsId: number;
  roomNumber: String;
  roomPrice: number;
  hotel: {
    hotelNameEng: String;
  }
  roomtype: {
    roomType: String;
  }
  roomstatus: {
    roomStatus: String;
  }
}


@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.css']
})
export class RoomComponent implements OnInit {
  
  room: Array<any>;
  hotel: Array<any>;
  roomstatus: Array<any>;
  roomtype: Array<any>;
  select: any  = {
    hotelNameSelect: '',
    roomstatusSelected: '',
    roomtypeSelected: '',
    inputRoomPrice: '',
    inputRoomNumber: '',
    imgSelect: '',
    memberUserName: String
  }


  displayedColumns: string[] = ['position', 'room_type', 'room_no', 'room_price', 'room_status', 'hotel'];
  dataSource = new RoomDataSource(this.hotelService);
  constructor(private router: Router,private route: ActivatedRoute,private hotelService: HotelService, private httpClient: HttpClient) { 
    this.select.memberUserName = this.route.snapshot.paramMap.get('inputUserName');
  }
  ngOnInit() {
    console.log(this.select.memberUserName);
      this.refresh();
      this.hotelService.getHotelNameEng().subscribe(data => {
        this.hotel = data;
        console.log(this.hotel);
      });
      this.hotelService.getRoomStatus().subscribe(data => {
        this.roomstatus = data;
        console.log(this.roomstatus);
      });
      this.hotelService.getRoomType().subscribe(data => {
        this.roomtype = data;
        console.log(this.roomtype);
      });
      
  }
  next(){
    this.router.navigate(['/roomstatus',this.select.memberUserName]);
  }
  add(){
    if(this.select.imgSelect === '' || this.select.roomstatusSelected === '' || this.select.roomtypeSelected === '' || this.select.inputRoomNumber  === ''||this.select.inputRoomPrice === ''){
      alert('Please Enter all Data');
      console.log(this.select.imSelect);
    }
    else {
      this.httpClient.post('http://localhost:8080/room/'+ this.select.roomtypeSelected + '/' +this.select.roomstatusSelected + '/' + this.select.inputRoomNumber + '/' + this.select.inputRoomPrice + '/' + this.select.imSelect + '/' + this.select.memberUserName, this.select)
      .subscribe(
        data => {
          console.log(data);
          if(data){
            console.log('PUT Request is successful',data);
            this.refresh();
          }
          else
            alert('Room number ' + this.select.inputRoomNumber + ' in hotel ' + this.select.hotelNameSelect + ' have alrady exist')
        },
        error =>{
          console.log('Error',error);
        }
      )
    }
    this.refresh();
  }
  selectRow(row){
    console.log(row)
  }
  refresh() {
    this.hotelService.getRoom().subscribe((res) => {
      this.room = res;
      this.dataSource = new RoomDataSource(this.hotelService);
    });
  }
}
export class RoomDataSource extends DataSource<any> {
  constructor(private hotelService: HotelService) {
    super();
  }
  connect(): Observable<Room[]> {
    return this.hotelService.getRoom();
  }
  disconnect() {}
}
