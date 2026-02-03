'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Barcode, AlertCircle, Check } from "lucide-react";
import { toast } from 'sonner';

interface BarcodeScannerProps {
  onBarcodeScanned: (barcode: string) => void;
  isProcessing?: boolean;
}

export function BarcodeScanner({ onBarcodeScanned, isProcessing = false }: BarcodeScannerProps) {
  const [barcode, setBarcode] = useState('');
  const [lastScannedTime, setLastScannedTime] = useState<number>(0);
  const [scannerConnected, setScannerConnected] = useState<boolean>(false);
  const [lastInputTime, setLastInputTime] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const scanTimeoutRef = useRef<NodeJS.Timeout | null>(null);  
  const [inputMode, setInputMode] = useState<'scanner' | 'manual'>('scanner');
  const scanSpeedTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  

  useEffect(() => {
    inputRef.current?.focus();
   
    const handleWindowClick = () => {
      if (document.activeElement !== inputRef.current) {
        inputRef.current?.focus();
      }
    };
    window.addEventListener('click', handleWindowClick);
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

useEffect(() => {
  let buffer = '';
  let lastTime = 0;
  let timeout: NodeJS.Timeout;

  const handleKeyDown = (e: KeyboardEvent) => {
    const now = Date.now();

    // Ignore if user is typing in an input (manual mode)
    if (
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement
    ) {
      return;
    }

    if (e.key === 'Enter') {
      if (buffer.length >= 4) {
        onBarcodeScanned(buffer);
        setScannerConnected(true);
      }
      buffer = '';
      return;
    }

    if (e.key.length !== 1) return;

    if (now - lastTime > 80) {
      buffer = '';
    }

    buffer += e.key;
    lastTime = now;

    clearTimeout(timeout);
    timeout = setTimeout(() => {
      buffer = '';
    }, 120);
  };

  window.addEventListener('keydown', handleKeyDown);
  return () => {
    window.removeEventListener('keydown', handleKeyDown);
    clearTimeout(timeout);
  };
}, [onBarcodeScanned]);


  const handleBarcodeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const currentTime = Date.now();
    const timeSinceLastKey = currentTime - lastScannedTime;
    
    if (e.key === 'Enter') {
      e.preventDefault();
      const input = barcode.trim();
      
      if (!input) {
        toast.error('Empty barcode');
        return;
      }

      
      const barcodes = input
        .split(/[\s,]+/)
        .map(b => b.trim())
        .filter(b => b.length > 0);

      if (barcodes.length > 1) {
       
        let addedCount = 0;
        let failedCount = 0;
        const failedBarcodes: string[] = [];

        barcodes.forEach(scannedBarcode => {
          if (scannedBarcode.length >= 3) {
            try {
              onBarcodeScanned(scannedBarcode);
              addedCount++;
            } catch (error) {
              failedCount++;
              failedBarcodes.push(scannedBarcode);
              console.error('Error adding barcode:', scannedBarcode, error);
            }
          }
        });

       
        if (addedCount > 0) {
          toast.success(`Added ${addedCount} item(s)`);
        }
        if (failedCount > 0) {
          toast.error(`Failed to add ${failedCount} item(s): ${failedBarcodes.join(', ')}`);
        }
      } else {
       
        const scannedBarcode = barcodes[0];

        if (scannedBarcode.length < 3) {
          toast.error('Invalid barcode format');
          return;
        }

        onBarcodeScanned(scannedBarcode);
      }

      
      setBarcode('');
      setLastScannedTime(0);
      setLastInputTime(0);
      inputRef.current?.focus();
    } else {
      setLastScannedTime(currentTime);

      if (scanTimeoutRef.current) {
        clearTimeout(scanTimeoutRef.current);
      }

      if (timeSinceLastKey > 100 && barcode.length > 0) {
      
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setBarcode(value);
    
   
    if (value.length === 1) {
      setLastInputTime(Date.now());
    }
  };

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg space-y-3 w-1/2">
      <div className="flex items-center gap-2">
        <Barcode className="h-5 w-5 text-blue-600" />
        <Label className="font-semibold text-blue-900">Barcode Scanner</Label>
        <div className="ml-auto flex items-center gap-2">
          {scannerConnected && (
            <Badge className="bg-green-500 text-white animate-pulse">
              ✓ Scanner Connected
            </Badge>
          )}
          <Badge variant="outline" className="text-gray-900 text-xs">
            USB/USB-C Ready
          </Badge>
        </div>
      </div>
      
      <div className="space-y-2">
        <Input
          ref={inputRef}
          type="text"
          placeholder={
            inputMode === 'scanner' 
              ? "Scan barcode here..." 
              : "Type/paste barcodes (space or comma separated)..."
          }
          value={barcode}
          onChange={(e) => {
            handleInputChange(e);
            if (e.target.value.length > 0) {
              setInputMode('manual');
            }
          }}
          onKeyDown={(e) => {
            handleBarcodeInput(e);
          }}
          onFocus={() => {
            if (barcode.length === 0) {
              setInputMode('scanner');
            }
          }}
          disabled={isProcessing}
          className="font-mono text-sm border-2 border-blue-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-500"
          autoComplete="off"
        />
        
        <div className="flex items-center gap-2 justify-between">
          <Badge variant="outline" className="text-xs text-gray-900">
            {barcode.length} chars
          </Badge>
          <Badge className={inputMode === 'scanner' ? 'bg-green-500' : 'bg-blue-500'}>
            {inputMode === 'scanner' ? '🔴 Scanner Mode' : '⌨️ Manual Mode'}
          </Badge>
        </div>

        <div className="flex items-start gap-2 p-2 bg-blue-100 rounded border border-blue-300 text-xs text-blue-800">
          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Scanner Tips:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Keep this input field focused</li>
              <li>Scan barcodes directly - Enter key is automatic</li>
              <li>Multiple scans increase quantity</li>
              {scannerConnected && (
                <li className="text-green-700 font-semibold">✓ Scanner detected and ready!</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}