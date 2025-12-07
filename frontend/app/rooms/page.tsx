'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Plus, MapPin, Users, Clock } from 'lucide-react';
import Link from 'next/link';
import { Button, Modal, Dialog } from '@/components/ui';
import { apiCall } from '@/lib/api-client';

interface Room {
  id: string;
  name: string;
  capacity: number;
  location: string;
  amenities: string[];
  available: boolean;
}

interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  bookedBy: string;
  date: string;
  startTime: string;
  endTime: string;
  purpose: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
}

export default function RoomsPage() {
  const { data: session } = useSession();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: roomsData } = await apiCall.get<Room[]>('/api/rooms');
        const { data: bookingsData } = await apiCall.get<Booking[]>('/api/bookings');
        
        setRooms(roomsData);
        setBookings(bookingsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setRooms([]);
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleBookRoom = async () => {
    try {
      // TODO: Call API to book room
      // await apiCall.post(`/api/rooms/${selectedRoom?.id}/bookings`, bookingData);
      setShowBookingForm(false);
      setSelectedRoom(null);
    } catch (error) {
      console.error('Failed to book room:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header - Enhanced */}
      <div className="p-8 rounded-3xl bg-linear-to-br from-moss-50 to-emerald-50 border-2 border-moss-100">
        <div className="inline-block px-4 py-2 bg-moss-600 text-white rounded-full text-xs font-bold mb-3">
          FACILITIES MANAGEMENT
        </div>
        <h1 className="text-5xl font-extrabold bg-linear-to-r from-moss-900 to-moss-700 bg-clip-text text-transparent mb-3 pb-2">
          Room Booking
        </h1>
        <p className="text-moss-800 text-lg">Book meeting rooms and conference facilities</p>
      </div>

      {/* Available Rooms Grid - Enhanced */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-extrabold text-moss-900 flex items-center gap-3">
            <span className="w-2 h-8 bg-linear-to-b from-moss-500 to-moss-700 rounded-full"></span>
            Available Rooms
          </h2>
          <span className="text-sm text-moss-900 bg-moss-100 px-5 py-2.5 rounded-full font-bold border-2 border-moss-200">
            {rooms.filter(r => r.available).length} Available Now
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={`group relative overflow-hidden rounded-3xl transition-all duration-300 ${
                room.available
                  ? 'bg-white border-2 border-moss-100 shadow-lg hover:shadow-2xl hover:-translate-y-3 cursor-pointer'
                  : 'bg-gray-50 border-2 border-gray-200 opacity-60'
              }`}
              onClick={() => room.available && setSelectedRoom(room)}
            >
              {/* Background Gradient */}
              {room.available && (
                <div className="absolute inset-0 bg-linear-to-br from-moss-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              )}

              <div className="relative p-7 space-y-5">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-lg text-moss-900">{room.name}</h3>
                    <p className="text-xs text-moss-600 mt-1 flex items-center gap-1">
                      <MapPin size={14} />
                      {room.location}
                    </p>
                  </div>
                  {room.available && (
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                      ✓ Available
                    </span>
                  )}
                </div>

                {/* Capacity */}
                <div className="pt-2 border-t border-moss-100">
                  <div className="flex items-center gap-3 p-3 bg-moss-50 rounded-xl group-hover:bg-moss-100 transition-colors">
                    <div className="p-2 bg-white rounded-lg">
                      <Users size={18} className="text-moss-600" />
                    </div>
                    <div>
                      <p className="text-xs text-moss-600 font-medium">Capacity</p>
                      <p className="text-sm font-bold text-moss-900">{room.capacity} people</p>
                    </div>
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <p className="text-xs font-semibold text-moss-800 mb-2 uppercase tracking-wide">Amenities</p>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map((amenity) => (
                      <span
                        key={amenity}
                        className="text-xs bg-linear-to-r from-moss-100 to-moss-200 text-moss-900 px-3 py-1.5 rounded-full font-semibold group-hover:from-moss-200 group-hover:to-moss-300 transition-all border border-moss-300"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                {room.available && (
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-full mt-2 bg-linear-to-r from-moss-500 to-moss-600 hover:from-moss-600 hover:to-moss-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRoom(room);
                      setShowBookingForm(true);
                    }}
                  >
                    <Plus size={16} />
                    Book Room
                  </Button>
                )}

                {!room.available && (
                  <div className="pt-2 p-3 bg-red-50 rounded-xl text-center">
                    <p className="text-sm font-semibold text-red-600">
                      Currently Unavailable
                    </p>
                    <p className="text-xs text-red-500 mt-1">Check back later</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Bookings */}
      <div className="bg-white rounded-2xl border border-moss-100 p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-moss-900">My Bookings</h2>
          <p className="text-sm text-moss-600 mt-2">{bookings.length} confirmed {bookings.length === 1 ? 'booking' : 'bookings'}</p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-block p-4 bg-moss-50 rounded-full mb-4">
              <Clock className="text-moss-600" size={32} />
            </div>
            <p className="text-moss-600 font-medium">No bookings yet</p>
            <p className="text-sm text-moss-500 mt-1">Book a room to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="group relative overflow-hidden rounded-xl border border-moss-100 bg-linear-to-r from-moss-50/50 to-transparent p-4 hover:shadow-md hover:border-moss-200 transition-all"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-moss-900">
                      {booking.roomName}
                    </h3>
                    <div className="flex flex-wrap gap-3 mt-2 text-sm text-moss-600">
                      <span className="flex items-center gap-1 font-medium">
                        📅 {new Date(booking.date + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}
                      </span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock size={14} />
                        {booking.startTime} - {booking.endTime}
                      </span>
                      <span className="text-xs bg-moss-100 px-2 py-1 rounded-full">{booking.purpose}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-bold px-4 py-2 rounded-full ${
                      booking.status === 'CONFIRMED'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {booking.status === 'CONFIRMED' ? '✓ Confirmed' : '⏳ ' + booking.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingForm}
        onClose={() => {
          setShowBookingForm(false);
          setSelectedRoom(null);
        }}
        title={`Book ${selectedRoom?.name}`}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-moss-900 mb-1">
              Date
            </label>
            <input
              type="date"
              className="w-full px-4 py-2 border border-moss-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-moss-900 mb-1">
                Start Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-moss-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-moss-900 mb-1">
                End Time
              </label>
              <input
                type="time"
                className="w-full px-4 py-2 border border-moss-200 rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-moss-900 mb-1">
              Purpose
            </label>
            <textarea
              className="w-full px-4 py-2 border border-moss-200 rounded-lg"
              rows={3}
              placeholder="Meeting purpose or agenda"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6 justify-end">
          <Button
            variant="ghost"
            onClick={() => {
              setShowBookingForm(false);
              setSelectedRoom(null);
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleBookRoom}>Confirm Booking</Button>
        </div>
      </Modal>
    </div>
  );
}
