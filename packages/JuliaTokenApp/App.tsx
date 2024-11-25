import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, Alert} from 'react-native';
import {ActivityIndicator, Button, Card} from 'react-native-paper';
import axios from 'axios';

interface BalanceResponse {
  balance: number;
}

interface MintResponse {
  success: boolean;
  newBalance: number;
}

const App: React.FC = () => {
  const [address, setAddress] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<string>('');
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeMode, setActiveMode] = useState<'balance' | 'mint' | null>(null);

  const apiUrl = 'https://elf-fluent-morally.ngrok-free.app/api';

  const fetchBalance = async (): Promise<void> => {
    setActiveMode('balance');
    setLoading(true);
    setError('');
    try {
      const response = await axios.get<BalanceResponse>(
        `${apiUrl}/balance/${address}`,
      );
      setBalance(response.data.balance);
    } catch {
      setError('Error fetching balance');
    } finally {
      setLoading(false);
    }
  };

  const mintToken = async (): Promise<void> => {
    setActiveMode('mint');
    setLoading(true);
    setError('');
    try {
      if (!address || !mintAmount) {
        setError('Please provide both address and mint amount.');
        return;
      }

      const response = await axios.post<MintResponse>(`${apiUrl}/mint`, {
        address,
        amount: mintAmount,
      });

      if (response.data.success) {
        setBalance(response.data.newBalance);
        Alert.alert('Success', 'Tokens minted successfully');
      } else {
        setError('Error minting tokens');
      }
    } catch {
      setError('Error minting tokens');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <Text style={styles.header}>Mint and Balance</Text>
      <Text style={styles.inputTitle}>Enter Your Wallet Address</Text>
      <TextInput
        placeholder="Enter Address"
        value={address}
        onChangeText={setAddress}
        style={styles.input}
      />
      <Text style={styles.inputTitle}>Enter Mint Amount</Text>
      <TextInput
        placeholder="Enter Mint Amount"
        value={mintAmount}
        onChangeText={setMintAmount}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button
        mode="contained"
        onPress={fetchBalance}
        style={[
          styles.button,
          activeMode === 'balance' && styles.activeButton,
        ]}>
        Fetch Balance
      </Button>
      {balance !== null && (
        <Card style={styles.card}>
          <Text style={styles.cardText}>Balance: {balance} BNB</Text>
        </Card>
      )}
      <Button
        mode="contained"
        onPress={mintToken}
        style={[styles.button, activeMode === 'mint' && styles.activeButton]}>
        Mint Tokens
      </Button>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    marginBottom: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  card: {
    padding: 16,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 1,
  },
});

export default App;
