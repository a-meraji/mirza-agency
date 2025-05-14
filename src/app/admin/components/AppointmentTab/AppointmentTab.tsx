import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/UI/button";
import AppointmentList from "./AppointmentList";
import AppointmentForm from "./AppointmentForm";
import { Appointment, AppointmentFormData } from "../../models/types";
import { 
  fetchAppointments, 
  createAppointment, 
  updateAppointment, 
  deleteAppointment 
} from "../../controllers/appointmentController";

export default function AppointmentTab() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      setLoading(true);
      try {
        const data = await fetchAppointments();
        setAppointments(data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, []);

  const handleCreateAppointment = async (formData: AppointmentFormData) => {
    try {
      const newAppointment = await createAppointment(formData);
      setAppointments((prev) => [...prev, newAppointment]);
      setShowForm(false);
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to create appointment"}`);
    }
  };

  const handleUpdateAppointment = async (formData: AppointmentFormData) => {
    if (!editingAppointment) return;
    
    try {
      const updatedAppointment = await updateAppointment(editingAppointment.id, formData);
      setAppointments((prev) => 
        prev.map((app) => app.id === updatedAppointment.id ? updatedAppointment : app)
      );
      setShowForm(false);
      setEditingAppointment(null);
    } catch (error) {
      console.error("Error updating appointment:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to update appointment"}`);
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!confirm("Are you sure you want to delete this appointment?")) {
      return;
    }
    
    try {
      await deleteAppointment(id);
      setAppointments((prev) => prev.filter((app) => app.id !== id));
    } catch (error) {
      console.error("Error deleting appointment:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to delete appointment"}`);
    }
  };

  const startEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  const handleFormSubmit = (formData: AppointmentFormData) => {
    if (editingAppointment) {
      handleUpdateAppointment(formData);
    } else {
      handleCreateAppointment(formData);
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingAppointment(null);
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-[#462d22]">جلسات موجود</h2>
        <Button 
          onClick={() => {
            setShowForm(true);
            setEditingAppointment(null);
          }}
          className="bg-[#fbeee0] border-2 border-[#422800] rounded-[30px] shadow-[4px_4px_0_0_#422800] text-[#422800] cursor-pointer font-semibold px-4 py-2 text-center no-underline select-none hover:bg-white active:shadow-[2px_2px_0_0_#422800] active:translate-y-[2px]"
        >
          <Plus className="ml-2 h-4 w-4" /> افزودن جلسه جدید
        </Button>
      </div>
      
      {showForm && (
        <AppointmentForm 
          editingAppointment={editingAppointment}
          onSubmit={handleFormSubmit}
          onCancel={cancelForm}
        />
      )}
      
      <AppointmentList 
        appointments={appointments}
        loading={loading}
        onEdit={startEdit}
        onDelete={handleDeleteAppointment}
      />
    </>
  );
} 