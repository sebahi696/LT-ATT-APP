import React, { useState, useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Snackbar
} from '@mui/material';
import {
  QrCode2 as QrCodeIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';

interface QRCodeData {
  _id: string;
  code: string;
  branch: string;
  type: 'checkIn' | 'checkOut';
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdBy: {
    name: string;
  };
}

const QRGenerator: React.FC = () => {
  const [branch, setBranch] = useState('');
  const [type, setType] = useState<'checkIn' | 'checkOut'>('checkIn');
  const [validityHours, setValidityHours] = useState('24');
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState<string | null>(null);

  const fetchQRCodes = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      setLoading(true);
      const response = await axios.get('/api/admin/qr-codes', {
        headers: { 'x-auth-token': token }
      });
      setQrCodes(response.data);
      setError('');
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.error || 'Error fetching QR codes';
      console.error('Error fetching QR codes:', err);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQRCodes();
  }, [fetchQRCodes]);

  const handleGenerateQR = async () => {
    if (!branch.trim()) {
      setError('Please enter a branch name');
      return;
    }

    if (isGenerating) return;

    setIsGenerating(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      const response = await axios.post(
        '/api/admin/qr-codes',
        {
          branch: branch.trim(),
          type,
          validityHours: parseInt(validityHours)
        },
        {
          headers: { 'x-auth-token': token }
        }
      );

      // Update the QR codes list without fetching all codes again
      setQrCodes(prevCodes => {
        // Deactivate any existing codes for the same branch and type
        const updatedCodes = prevCodes.map(code => 
          code.branch === branch && code.type === type
            ? { ...code, isActive: false }
            : code
        );
        // Add the new code
        return [response.data, ...updatedCodes];
      });

      setBranch('');
      setType('checkIn');
      setValidityHours('24');
      setSuccess('QR code generated successfully');
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.error || 'Error generating QR code';
      setError(errorMsg);
      console.error('Error generating QR code:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    if (isDeactivating === id) return;

    setIsDeactivating(id);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      await axios.delete(`/api/admin/qr-codes/${id}`, {
        headers: { 'x-auth-token': token }
      });

      // Update the local state without fetching all codes again
      setQrCodes(prevCodes =>
        prevCodes.map(code =>
          code._id === id ? { ...code, isActive: false } : code
        )
      );
      setSuccess('QR code deactivated successfully');
    } catch (err: any) {
      const errorMsg = err.response?.data?.msg || err.response?.data?.error || 'Error deactivating QR code';
      setError(errorMsg);
      console.error('Error deactivating QR code:', err);
    } finally {
      setIsDeactivating(null);
    }
  };

  if (loading && qrCodes.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        QR Code Generator
      </Typography>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!success}
        autoHideDuration={6000}
        onClose={() => setSuccess('')}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSuccess('')} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generate New QR Code
              </Typography>
              <TextField
                fullWidth
                label="Branch Name"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                sx={{ mb: 2 }}
                required
                error={!branch.trim() && branch !== ''}
                helperText={!branch.trim() && branch !== '' ? 'Branch name is required' : ''}
                disabled={isGenerating}
              />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  value={type}
                  label="Type"
                  onChange={(e) => setType(e.target.value as 'checkIn' | 'checkOut')}
                  disabled={isGenerating}
                >
                  <MenuItem value="checkIn">Check In</MenuItem>
                  <MenuItem value="checkOut">Check Out</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                label="Validity (hours)"
                type="number"
                value={validityHours}
                onChange={(e) => setValidityHours(e.target.value)}
                sx={{ mb: 2 }}
                inputProps={{ min: 1 }}
                disabled={isGenerating}
              />
              <Button
                variant="contained"
                onClick={handleGenerateQR}
                disabled={isGenerating || !branch.trim() || !type || !validityHours}
                startIcon={isGenerating ? <CircularProgress size={20} /> : <QrCodeIcon />}
                fullWidth
              >
                {isGenerating ? 'Generating...' : 'Generate QR Code'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Active QR Codes
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>QR Code</TableCell>
                  <TableCell>Branch</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Valid Until</TableCell>
                  <TableCell>Created By</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {qrCodes
                  .filter((qr) => qr.isActive)
                  .map((qr) => (
                    <TableRow key={qr._id}>
                      <TableCell>
                        <QRCodeSVG value={qr.code} size={100} />
                      </TableCell>
                      <TableCell>{qr.branch}</TableCell>
                      <TableCell>{qr.type}</TableCell>
                      <TableCell>
                        {new Date(qr.validUntil).toLocaleString()}
                      </TableCell>
                      <TableCell>{qr.createdBy?.name}</TableCell>
                      <TableCell>
                        <IconButton
                          color="error"
                          onClick={() => handleDeactivate(qr._id)}
                          disabled={isDeactivating === qr._id}
                        >
                          {isDeactivating === qr._id ? (
                            <CircularProgress size={24} color="error" />
                          ) : (
                            <DeleteIcon />
                          )}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                {qrCodes.filter(qr => qr.isActive).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No active QR codes found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default QRGenerator; 