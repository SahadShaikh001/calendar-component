import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '@/components/primitives/Modal';
import { CalendarEvent } from './CalendarView.types';

interface Props {
  open: boolean;
  event?: CalendarEvent | null;
  onClose: () => void;
  onSave: (data: CalendarEvent) => void;
  onDelete?: (id: string) => void;
}

export const EventModal: React.FC<Props> = ({ open, event, onClose, onSave, onDelete }) => {
  const { register, handleSubmit, reset } = useForm<CalendarEvent>({
    defaultValues: {
      id: '',
      title: '',
      description: '',
      startDate: new Date(),
      endDate: new Date(),
      color: '#3b82f6',
      category: 'General',
    },
  });

  // Populate form when editing an event
  useEffect(() => {
    if (event) {
      reset({
        ...event,
        startDate: new Date(event.startDate),
        endDate: new Date(event.endDate),
      });
    } else {
      reset({
        id: '',
        title: '',
        description: '',
        startDate: new Date(),
        endDate: new Date(),
        color: '#3b82f6',
        category: 'General',
      });
    }
  }, [event, reset]);

  const onSubmit = (data: CalendarEvent) => {
    const finalEvent: CalendarEvent = {
      ...data,
      id: event?.id || Math.random().toString(36).substr(2, 9),
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    };
    onSave(finalEvent);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <Modal open={open} title={event ? 'Edit Event' : 'Create Event'} onClose={onClose}>
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                {...register('title', { required: true })}
                type="text"
                placeholder="Enter event title"
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                {...register('description')}
                placeholder="Enter description"
                rows={3}
                className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary-500"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  {...register('startDate', { required: true })}
                  type="datetime-local"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  {...register('endDate', { required: true })}
                  type="datetime-local"
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Color & Category */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                <input
                  {...register('color')}
                  type="color"
                  className="w-full h-10 border rounded-md p-1 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  {...register('category')}
                  className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-primary-500"
                >
                  <option value="General">General</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Holiday">Holiday</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t">
              {event && onDelete && (
                <motion.button
                  type="button"
                  onClick={() => onDelete(event.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
              )}
              <div className="ml-auto flex gap-2">
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {event ? 'Update' : 'Save'}
                </motion.button>
              </div>
            </div>
          </motion.form>
        </Modal>
      )}
    </AnimatePresence>
  );
};
