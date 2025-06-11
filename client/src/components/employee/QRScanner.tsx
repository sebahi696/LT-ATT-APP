import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

interface CameraDevice {
  id: string;
  label: string;
}

const QRScanner: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);
  const [cameraPermission, setCameraPermission] = useState<PermissionState | null>(null);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [availableCameras, setAvailableCameras] = useState<CameraDevice[]>([]);
  const [selectedCamera, setSelectedCamera] = useState('');
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null);
  const qrReaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const lastScanTime = localStorage.getItem('lastScan');
    if (lastScanTime) {
      setLastScan(new Date(lastScanTime));
    }

    return () => {
      stopScanning();
    };
  }, []);

  const listCameras = async () => {
    try {
      const devices = await Html5Qrcode.getCameras();
      console.log('Available cameras:', devices);
      
      const formattedDevices = devices.map(device => ({
        id: device.id,
        label: device.label || `Camera ${device.id}`
      }));
      
      setAvailableCameras(formattedDevices);
      
      // Prefer back camera on mobile devices
      const backCamera = formattedDevices.find(device => 
        device.label.toLowerCase().includes('back')
      );
      
      setSelectedCamera(backCamera?.id || (formattedDevices[0]?.id || ''));
      return formattedDevices;
    } catch (err) {
      console.error('Error listing cameras:', err);
      setError('Failed to access camera list. Please ensure camera permissions are granted.');
      return [];
    }
  };

  const startScanning = async () => {
    try {
      setError('');
      setSuccess('');
      setScanning(true);

      // Request camera permission first
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      stream.getTracks().forEach(track => track.stop());

      // List available cameras
      await listCameras();

      // Wait for the element to be available in the DOM
      await new Promise(resolve => setTimeout(resolve, 100));

      // Initialize QR scanner
      if (!html5QrCodeRef.current) {
        html5QrCodeRef.current = new Html5Qrcode('qr-reader');
      }

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0
      };

      const cameraId = selectedCamera || { facingMode: 'environment' };
      
      await html5QrCodeRef.current.start(
        cameraId,
        config,
        handleScanSuccess,
        handleScanError
      );

      console.log('Scanner started successfully');
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError('Failed to start camera. Please ensure camera permissions are granted and try again.');
      setScanning(false);
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      }
    }
  };

  const handleScanSuccess = async (decodedText: string) => {
    if (loading) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found');
        return;
      }

      const response = await axios.post(
        '/api/employee/attendance/scan',
        { qrCode: decodedText },
        { headers: { 'x-auth-token': token } }
      );

      setSuccess(response.data.msg);
      const now = new Date();
      localStorage.setItem('lastScan', now.toISOString());
      setLastScan(now);

      await stopScanning();
    } catch (err: any) {
      console.error('Error scanning QR code:', err);
      setError(err.response?.data?.msg || 'Error scanning QR code');
    } finally {
      setLoading(false);
    }
  };

  const handleScanError = (error: string | Error) => {
    // Only log errors that aren't related to normal scanning process
    if (typeof error === 'string' && !error.includes('No QR code found')) {
      console.error('Scan error:', error);
    }
  };

  const stopScanning = async () => {
    if (html5QrCodeRef.current?.isScanning) {
      try {
        await html5QrCodeRef.current.stop();
        await html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
        setScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  const canScanAgain = () => {
    if (!lastScan) return true;
    const now = new Date();
    const timeDiff = now.getTime() - lastScan.getTime();
    const minutesDiff = Math.floor(timeDiff / 1000 / 60);
    return minutesDiff >= 1;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Scan QR Code
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
        <CardContent>
          {!scanning ? (
            <>
              <Typography variant="h6" gutterBottom>
                Ready to Scan
              </Typography>
              
              {availableCameras.length > 1 && (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Select Camera</InputLabel>
                  <Select
                    value={selectedCamera}
                    label="Select Camera"
                    onChange={(e) => setSelectedCamera(e.target.value)}
                  >
                    {availableCameras.map((camera) => (
                      <MenuItem key={camera.id} value={camera.id}>
                        {camera.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              <Button
                variant="contained"
                fullWidth
                onClick={startScanning}
                disabled={loading || !canScanAgain()}
              >
                {loading ? (
                  <CircularProgress size={24} />
                ) : !canScanAgain() ? (
                  'Please wait before scanning again'
                ) : (
                  'Start Scanning'
                )}
              </Button>
            </>
          ) : (
            <>
              <div id="qr-reader" style={{ width: '100%', minHeight: '300px' }} />
              <Button
                variant="outlined"
                fullWidth
                onClick={stopScanning}
                sx={{ mt: 2 }}
              >
                Stop Scanning
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {lastScan && (
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ mt: 2 }}
        >
          Last successful scan: {lastScan.toLocaleString()}
        </Typography>
      )}

      <Dialog
        open={showPermissionDialog}
        onClose={() => setShowPermissionDialog(false)}
      >
        <DialogTitle>Camera Permission Required</DialogTitle>
        <DialogContent>
          <Typography>
            To scan QR codes, you need to enable camera access in your browser settings.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPermissionDialog(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QRScanner; 