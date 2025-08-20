import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList, Alert } from 'react-native';
import { Stack } from 'expo-router';
import { saveWhatsappContacts, loadWhatsappContacts, FavoriteContact } from '../services/StorageService';

export default function WhatsAppScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [contacts, setContacts] = useState<FavoriteContact[]>([]);

  useEffect(() => {
    // Load contacts when the component mounts
    const loadData = async () => {
      const loadedContacts = await loadWhatsappContacts();
      setContacts(loadedContacts);
    };
    loadData();
  }, []);

  const handleAddContact = async () => {
    if (!name || !phone) {
      Alert.alert('Error', 'Nama dan nomor telepon tidak boleh kosong.');
      return;
    }
    const newContact = { id: Date.now().toString(), name, phone };
    const updatedContacts = [...contacts, newContact];
    await saveWhatsappContacts(updatedContacts);
    setContacts(updatedContacts);
    setName('');
    setPhone('');
  };

  const handleDeleteContact = async (id: string) => {
    const updatedContacts = contacts.filter(c => c.id !== id);
    await saveWhatsappContacts(updatedContacts);
    setContacts(updatedContacts);
  };

  const renderItem = ({ item }: { item: FavoriteContact }) => (
    <View style={styles.contactItem}>
      <View>
        <Text style={styles.contactName}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>
      <Button title="Hapus" onPress={() => handleDeleteContact(item.id)} color="red" />
    </View>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Kontak Favorit WhatsApp' }} />
      <Text style={styles.title}>Kontak Favorit WhatsApp</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Nama Kontak (misal: Rumah)"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Nomor Telepon (misal: 62812...)"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <Button title="Tambah Kontak Favorit" onPress={handleAddContact} />
      </View>

      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 24,
    textAlign: 'center',
  },
  form: {
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 16,
    color: '#666',
  },
});
