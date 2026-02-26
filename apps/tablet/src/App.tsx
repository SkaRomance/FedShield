import { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Company, login, loadCompanies } from "./services/api";

export default function App() {
  const [email, setEmail] = useState("senior@fedshield.local");
  const [password, setPassword] = useState("fedshield123");
  const [token, setToken] = useState<string | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headerText = useMemo(() => (token ? "Aziende assegnate" : "Accesso consulente"), [token]);

  async function handleLogin() {
    setLoading(true);
    setError(null);
    try {
      const result = await login(email, password);
      setToken(result.token);
      const items = await loadCompanies(result.token);
      setCompanies(items);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Errore non previsto";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <Text style={styles.title}>FedShield</Text>
        <Text style={styles.subtitle}>{headerText}</Text>

        <TextInput style={styles.input} value={email} onChangeText={setEmail} autoCapitalize="none" />
        <TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Entra</Text>}
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.topRow}>
        <Text style={styles.title}>FedShield</Text>
        <TouchableOpacity
          onPress={() => {
            setToken(null);
            setCompanies([]);
          }}
        >
          <Text style={styles.logout}>Esci</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>{headerText}</Text>

      <FlatList
        data={companies}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardMeta}>P.IVA: {item.vatNumber}</Text>
            <Text style={styles.cardMeta}>ATECO: {item.atecoCode ?? "N/D"}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nessuna azienda disponibile.</Text>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f3f3",
    paddingHorizontal: 18,
    paddingTop: 24,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#7a1425",
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    color: "#667085",
    fontSize: 15,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e6d8da",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#8d1f33",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "#b42318",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#eadbdd",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#101828",
  },
  cardMeta: {
    fontSize: 13,
    color: "#475467",
    marginTop: 2,
  },
  empty: {
    marginTop: 20,
    color: "#667085",
  },
  logout: {
    color: "#8d1f33",
    fontWeight: "600",
  },
});
